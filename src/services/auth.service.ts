import { inject, injectable } from 'inversify';

import { TYPES } from '../types';
import * as apiError from '../utils/api-error';
import strings from '../config/strings';
import { userEmitter } from '../subscribers/emitters';
import constants, { Role as RoleEnum, events } from '../config/constants';
import User from '../entities/user.entity';

import { IAuthService, ILoginInput, ILoginResponse, IRegisterInput } from '../interfaces/auth.interface';
import { IHashService, ITokenService } from '../interfaces/common.interface';
import { IUserRepository } from '../interfaces/user.interface';

@injectable()
export default class AuthService implements IAuthService {
  private name = 'AuthService';
  private userRepository: IUserRepository;
  private hashService: IHashService;
  private tokenService: ITokenService;

  constructor(
    @inject(TYPES.UserRepository) _userRepository: IUserRepository,
    @inject(TYPES.HashService) _hashService: IHashService,
    @inject(TYPES.TokenService) _tokenService: ITokenService
  ) {
    this.userRepository = _userRepository;
    this.hashService = _hashService;
    this.tokenService = _tokenService;
  }

  login = async (args: ILoginInput): Promise<ILoginResponse> => {
    try {
      const email = args.email?.toLowerCase()?.trim();
      const password = args.password;

      let user = await this.userRepository.getSingleEntity({
        query: {
          email,
        },
        relations: ['roles'],
      });

      if (!user) {
        throw new apiError.NotAuthenticatedError({
          details: [strings.emailPasswordNotCorrect],
        });
      }

      const userPassword: any = user.password;

      let isPasswordCorrect = await this.hashService.compare(password, userPassword);
      if (!isPasswordCorrect) {
        throw new apiError.NotAuthenticatedError({
          details: [strings.emailPasswordNotCorrect],
        });
      }

      let payload = {
        id: user?.id,
        roles: user.roles.map((role) => role.id),
      };

      let token = await this.tokenService.generateToken({
        payload: payload,
        tokenSecret: constants.accessTokenSecret,
        tokenLife: constants.accessTokenLife,
      });

      return {
        id: user.id,
        token: token,
        roles: user.roles,
      };
    } catch (err) {
      throw err;
    }
  };

  register = async (args: IRegisterInput): Promise<User> => {
    try {
      const email = args.email;
      const name = args.name;
      const phone = args.phone;
      const roles = [RoleEnum.User];
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
}
