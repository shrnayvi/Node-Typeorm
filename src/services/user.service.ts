import { injectable, inject } from 'inversify';

import Paging from '../utils/paging';
import { TYPES } from '../types';
import User from '../entities/user.entity';
import { events } from '../config/constants';
import userEmitter from '../subscribers/user.subscriber';

import { IPagingArgs, IPaginationData } from '../interfaces/paging.interface';
import { IEntityRemove, IEntityID, ITemplateService, IEmailService, ILogger } from '../interfaces/common.interface';
import { IUserRepository } from '../interfaces/user.interface';
import { IUserCreate, IUserUpdate, IUserService } from '../interfaces/user.interface';

@injectable()
export default class UserService implements IUserService {
  private userRepository: IUserRepository;
  private handlebarsService: ITemplateService;
  private emailService: IEmailService;
  private logger: ILogger;

  constructor(
    @inject(TYPES.UserRepository) _userRepository: IUserRepository,
    @inject(TYPES.HandlebarsService) _handlebarsService: ITemplateService,
    @inject(TYPES.EmailService) _emailService: IEmailService,
    @inject(TYPES.LoggerFactory) loggerFactory: (name: string) => ILogger
  ) {
    this.userRepository = _userRepository;
    this.handlebarsService = _handlebarsService;
    this.emailService = _emailService;
    this.logger = loggerFactory('UserService');
  }

  getAllAndCount = async (args: IPagingArgs): Promise<IPaginationData<User>> => {
    try {
      const { rows, count } = await this.userRepository.getAllAndCount(args);

      const paging = Paging.getPagingResult({
        ...args,
        total: count,
      });

      return {
        paging,
        data: rows,
      };
    } catch (err) {
      throw err;
    }
  };

  create = async (args: IUserCreate): Promise<User> => {
    const operation = 'create';

    try {
      const email = args.email;
      const name = args.name;
      const phone = args.phone;
      const roles = args.roles;
      const password = args.password;

      const user = await this.userRepository.create({
        email,
        password,
        name,
        phone,
        roles,
      });

      // Emit event for onUserCreate
      userEmitter.emit(events.onUserCreate, {
        user: user,
      });

      return user;
    } catch (err) {
      throw err;
    }
  };

  update = async (args: IUserUpdate): Promise<User> => {
    try {
      const id = args.id;
      const name = args.name;
      const phone = args.phone;

      const user = await this.userRepository.update({
        id,
        name,
        phone,
      });

      return user;
    } catch (err) {
      throw err;
    }
  };

  remove = (args: IEntityRemove): Promise<User> => {
    throw new Error('not implemented');
  };

  getById = async (args: IEntityID): Promise<User | undefined> => {
    try {
      const id = args.id;

      return await this.userRepository.getById({ id });
    } catch (err) {
      throw err;
    }
  };
}
