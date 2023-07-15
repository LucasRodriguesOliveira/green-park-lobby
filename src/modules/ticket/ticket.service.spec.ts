import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomBytes, randomInt } from 'crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { cwd } from 'process';
import { Batch } from '../batch/entity/batch.entity';
import { CreateTicketReportResponseDto } from './dto/create-ticket-report-response.dto';
import { CreateTicketResponseDto } from './dto/create-ticket-response.dto';
import { QueryTicketDto } from './dto/query-ticket.dto';
import { Ticket } from './entity/ticket.entity';
import { TicketService } from './ticket.service';
import { ReportOptions } from './type/report-options.enum';
import { ListTicketResponseDto } from './dto/list-ticket-response.dto';

describe('TicketService', () => {
  let service: TicketService;
  const getMany = jest.fn();
  const ticketRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany,
    })),
  };
  const batchRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: getRepositoryToken(Ticket),
          useValue: ticketRepository,
        },
        {
          provide: getRepositoryToken(Batch),
          useValue: batchRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<TicketService>(TicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const batches: Batch[] = [
    {
      id: 1,
      name: '17',
      tickets: [],
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    },
    {
      id: 1,
      name: '18',
      tickets: [],
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    },
    {
      id: 1,
      name: '19',
      tickets: [],
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    },
  ];

  const tickets: Ticket[] = batches.map((batch, index) => ({
    id: index,
    name: randomBytes(10).toString('hex'),
    value: randomInt(1, 100),
    batch,
    code: randomBytes(20).toString('hex'),
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  }));

  describe('registerTicketsCSV', () => {
    const fileBuffer = readFileSync(`${cwd()}/mocks/planilha boletos.csv`);
    const csvFile: Express.Multer.File = {
      buffer: fileBuffer,
      destination: '',
      fieldname: '',
      filename: 'csvFile',
      mimetype: 'text/csv',
      originalname: 'planilha boletos',
      path: '',
      size: fileBuffer.byteLength,
      stream: null,
      encoding: '',
    };

    const expected = CreateTicketResponseDto.from(tickets);

    beforeAll(() => {
      batchRepository.find.mockResolvedValueOnce(batches);
      ticketRepository.create.mockResolvedValueOnce(tickets);
      ticketRepository.save.mockResolvedValueOnce(tickets);
    });

    it('should read the file and save the tickets', async () => {
      const result = await service.registerTicketsCSV(csvFile);

      expect(result).toStrictEqual(expected);
      expect(batchRepository.find).toHaveBeenCalled();
      expect(ticketRepository.create).toHaveBeenCalled();
      expect(ticketRepository.save).toHaveBeenCalled();
    });
  });

  describe('saveTicketsPDF', () => {
    const pdfFileBuffer = readFileSync(`${cwd()}/mocks/BOLETOS.pdf`);
    const pdfFile: Express.Multer.File = {
      buffer: pdfFileBuffer,
      destination: '',
      fieldname: '',
      filename: 'file',
      mimetype: 'application/pdf',
      originalname: 'BOLETOS',
      path: '',
      size: pdfFileBuffer.byteLength,
      stream: null,
      encoding: '',
    };

    beforeEach(() => {
      ticketRepository.find.mockResolvedValueOnce(tickets);
    });

    it('should create a pdf file for each page in a original pdf file', async () => {
      await service.saveTicketsPDF(pdfFile);

      const result = readdirSync(`${cwd()}/boletos`, { withFileTypes: true });

      expect(result).toHaveLength(tickets.length);

      result.forEach(({ name }) => {
        const [fileName, fileExtesion] = name.split('.');

        expect(fileName).toMatch(/\d{1,}/);
        expect(
          tickets.findIndex((ticket) => ticket.id === parseInt(fileName)),
        ).toBeGreaterThanOrEqual(0);
        expect(fileExtesion).toBe('pdf');
      });
    });
  });

  describe('list', () => {
    const queryTicketDto: QueryTicketDto = {
      batchId: 1,
      finalValue: 0,
      name: '',
      startValue: 0,
    };

    describe(`Report - ${ReportOptions.BASE64}`, () => {
      const queryTicketDtoBase64 = {
        ...queryTicketDto,
        report: ReportOptions.BASE64,
      };

      beforeEach(() => {
        getMany.mockResolvedValueOnce(tickets);
      });

      it('should return a list of tickets in a base64 file result', async () => {
        const result = (await service.list(
          queryTicketDtoBase64,
        )) as CreateTicketReportResponseDto;

        expect(typeof result.base64).toBe('string');
        expect(result.base64.length).toBeGreaterThan(500);
        expect(getMany).toHaveBeenCalled();
      });
    });

    describe(`Report - ${ReportOptions.PDF_FILE}`, () => {
      const queryTicketDtoPDF_FILE = {
        ...queryTicketDto,
        report: ReportOptions.PDF_FILE,
      };

      beforeEach(() => {
        getMany.mockResolvedValueOnce(tickets);
      });

      it('should create a pdf file based in the result of a list of tickets and store it locally', async () => {
        await service.list(queryTicketDtoPDF_FILE);

        const reportDir = readdirSync(`${cwd()}/report`, {
          withFileTypes: true,
        });

        expect(reportDir).toHaveLength(1);
        expect(reportDir).toHaveProperty('0.name', 'ticket.report.pdf');
        expect(getMany).toHaveBeenCalled();
      });
    });

    describe(`Report - ${ReportOptions.NO_REPORT}`, () => {
      const queryTicketDtoNO_REPORT = {
        ...queryTicketDto,
        report: ReportOptions.NO_REPORT,
      };
      const expected = ListTicketResponseDto.from(tickets);

      beforeEach(() => {
        getMany.mockResolvedValueOnce(tickets);
      });

      it('should return a list of tickets', async () => {
        const result = await service.list(queryTicketDtoNO_REPORT);

        expect(result).toStrictEqual(expected);
        expect(getMany).toHaveBeenCalled();
      });
    });
  });
});
