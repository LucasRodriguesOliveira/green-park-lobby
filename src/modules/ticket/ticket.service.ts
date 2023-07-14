import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parse } from 'csv/sync';
import { readFileSync } from 'fs';
import pdf from 'pdf-creator-node';
import { PDFExtract } from 'pdf.js-extract';
import { cwd } from 'process';
import { Like, Repository } from 'typeorm';
import { Batch } from '../batch/entity/batch.entity';
import { CreateTicketReportResponseDto } from './dto/create-ticket-report-response.dto';
import { CreateTicketResponseDto } from './dto/create-ticket-response.dto';
import { CsvTicket } from './dto/csv-ticket';
import { ListTicketResponseDto } from './dto/list-ticket-response.dto';
import { QueryTicketDto } from './dto/query-ticket.dto';
import { Ticket } from './entity/ticket.entity';
import { ReportOptions } from './type/report-options.enum';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
  ) {}

  /*
    receives a csv file with exported data from financial app
    clean, map, link data (batch->ticket) and stores
  */
  public async registerTicketsCSV(
    file: Express.Multer.File,
  ): Promise<CreateTicketResponseDto[]> {
    //[CLEAN] converts csv buffer to json-like
    const csvTickets: CsvTicket[] = parse(file.buffer, {
      delimiter: ',',
      columns: true,
      skipEmptyLines: true,
    });

    //[MAP] lookup in batch to make a link with the batch in csv file
    const batches = await this.batchRepository.find({
      select: ['id', 'name'],
      where: [
        ...csvTickets.map((ticket) => ({
          name: Like(`%${ticket.unidade}`),
        })),
      ],
    });

    //[LINK] makes the relation between ticket and batch
    const ticketsToSave = this.ticketRepository.create(
      csvTickets.map(({ nome, unidade, linha_digitavel, valor }) => ({
        name: nome,
        value: parseFloat(valor),
        batch: batches.find(
          (batch) => parseInt(batch.name) === parseInt(unidade),
        ),
        code: linha_digitavel,
      })),
    );

    //[STORE] saves the data
    const tickets = await this.ticketRepository.save(ticketsToSave);

    // formats a friendly result to OpenAPI
    return CreateTicketResponseDto.from(tickets);
  }

  public async saveTicketsPDF(file: Express.Multer.File) {
    // Extracts the content in a json-like result
    const { pages } = await new PDFExtract().extractBuffer(file.buffer);

    // [ ['line1', 'line2'], ['line1', 'line2'] ]
    const formattedPages = pages.map((page) =>
      page.content
        .filter((line) => line.str.trim().length > 0)
        .map((line) => line.str),
    );
    const filteredRows = formattedPages
      .flat()
      .filter((row) => row.includes('UNIDADE'));

    /*
      In this case where is a controlled situation with few data
      to iterate and search for and there's no pattern to determine where is
      the desired content, there is no problem iterating over all the results
      since the effects in performance are really low. Otherwise, would be
      recommended to filter the data properly looking for patterns or other ways
      to manipulate the data in the pursuit to fetch the correct data the in database
    */
    const tickets = await this.ticketRepository.find({
      select: ['id', 'batch'],
      where: [
        ...filteredRows.map((line) => ({
          batch: {
            name: Like(`%${line.replace(/\D/g, '')}`),
          },
        })),
      ],
      relations: {
        batch: true,
      },
      order: {
        id: 'ASC',
      },
    });

    // assign each ticket from pdf with it respective ticket in database
    // produces a pdf file for each one of them in folder `boletos` at root
    formattedPages
      .map((page) => ({
        content: page,
        id: tickets.find((ticket) =>
          page.includes(`UNIDADE: ${parseInt(ticket.batch.name)}`),
        ).id,
      }))
      .forEach((ticket) => {
        pdf.create(
          {
            html: readFileSync(
              `${cwd()}/template/ticket.template.html`,
              'utf8',
            ),
            data: ticket,
            path: `./boletos/${ticket.id}.pdf`,
            type: '',
          },
          {
            format: 'Letter',
            orientation: 'portrait',
            border: '10mm',
          },
        );
      });
  }

  public async list(
    queryTicketDto: QueryTicketDto,
  ): Promise<ListTicketResponseDto[] | any> {
    const queryBuilder = this.ticketRepository
      .createQueryBuilder('ticket')
      .select('ticket.id')
      .addSelect('ticket.name')
      .addSelect('ticket.value')
      .addSelect('ticket.code')
      .addSelect('ticket.status')
      .addSelect('ticket.createdAt')
      .addSelect('batch.id')
      .addSelect('batch.name')
      .leftJoinAndSelect('ticket.batch', 'batch');

    if (queryTicketDto?.batchId) {
      queryBuilder.andWhere('batch.id = :batchId', {
        batchId: queryTicketDto.batchId,
      });
    }

    if (queryTicketDto?.name) {
      queryBuilder.andWhere('ticket.name LIKE :name', {
        name: `%${queryTicketDto.name}%`,
      });
    }

    if (queryTicketDto?.startValue) {
      queryBuilder.andWhere('ticket.value >= :startValue', {
        startValue: queryTicketDto.startValue,
      });
    }

    if (queryTicketDto?.finalValue) {
      queryBuilder.andWhere('ticket.value <= :finalValue', {
        finalValue: queryTicketDto.finalValue,
      });
    }

    const tickets = await queryBuilder.getMany();

    if (
      !queryTicketDto.report ||
      queryTicketDto?.report === ReportOptions.NO_REPORT
    ) {
      return ListTicketResponseDto.from(tickets);
    }

    const report = await this.createTicketReport(
      tickets,
      queryTicketDto.report,
    );
    return CreateTicketReportResponseDto.from(report);
  }
  public async createTicketReport(
    tickets: Ticket[],
    reportOption: ReportOptions,
  ): Promise<Buffer> {
    const fmtTickets = tickets.map((ticket) => ({
      ...ticket,
      fmtValue: ticket.value.toLocaleString('BR', {
        style: 'currency',
        currency: 'BRL',
        currencyDisplay: 'symbol',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    }));

    return pdf.create(
      {
        html: readFileSync(
          `${cwd()}/template/ticket-report.template.html`,
          'utf8',
        ),
        data: {
          tickets: fmtTickets,
        },
        type: reportOption === ReportOptions.PDF_FILE ? '' : 'buffer',
        path: './report/ticket.report.pdf',
      },
      {
        format: 'Letter',
        orientation: 'portrait',
      },
    );
  }
}
