import { Test, TestingModule } from '@nestjs/testing';
import { UserTypeService } from './user-type.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserType } from './entity/user-type.entity';
import { ListUserTypeResponseDto } from './dto/list-user-type-response.dto';
import { CreateUserTypeResponseDto } from './dto/create-user-type-response.dto';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeResponseDto } from './dto/update-user-type-response.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { UserTypeController } from './user-type.controller';

describe('UserTypeController', () => {
  let service: UserTypeService;
  let controller: UserTypeController;
  const repository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserTypeController],
      providers: [
        UserTypeService,
        {
          provide: getRepositoryToken(UserType),
          useValue: repository,
        },
      ],
    }).compile();

    service = moduleRef.get<UserTypeService>(UserTypeService);
    controller = moduleRef.get<UserTypeController>(UserTypeController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  const userType: UserType = {
    id: 1,
    description: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
    users: [],
    permissionGroups: [],
  };

  describe('List', () => {
    const userTypeExpected = ListUserTypeResponseDto.from([userType]);

    beforeEach(() => {
      repository.find.mockResolvedValueOnce([userType]);
    });

    it('should return a list of user types', async () => {
      const result = await controller.list();

      expect(result).toStrictEqual(userTypeExpected);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('Create', () => {
    const userTypeExpected = CreateUserTypeResponseDto.from(userType);
    const createUserTypeDto: CreateUserTypeDto = {
      description: userType.description,
    };

    beforeEach(() => {
      repository.save.mockResolvedValueOnce(userType);
    });

    it('should create successfully a user type', async () => {
      const result = await controller.create(createUserTypeDto);

      expect(result).toStrictEqual(userTypeExpected);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    const userTypeExpected = UpdateUserTypeResponseDto.from(userType);
    const updateUserTypeDto: UpdateUserTypeDto = {
      description: userType.description,
    };

    beforeEach(() => {
      repository.findOneBy.mockResolvedValueOnce(userType);
    });

    it('should update the user type', async () => {
      const result = await controller.update(userType.id, updateUserTypeDto);

      expect(result).toStrictEqual(userTypeExpected);
      expect(repository.update).toHaveBeenCalled();
      expect(repository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    beforeEach(() => {
      repository.softDelete.mockResolvedValueOnce({ affected: 1 });
    });

    it('should delete the user type', async () => {
      const result = await controller.delete(userType.id);

      expect(result).toBe(true);
      expect(repository.softDelete).toHaveBeenCalled();
    });
  });
});
