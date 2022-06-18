const COMMON = {
  AppService: Symbol('AppService'),
  AppController: Symbol('AppController'),
  Logger: Symbol('Logger'),
  LoggerFactory: Symbol('LoggerFactory'),
  GraphqlService: Symbol('GrahqlService'),
  HashService: Symbol('HashService'),
  TokenService: Symbol('TokenService'),
  EmailService: Symbol('EmailService'),
  ErrorService: Symbol('ErrorService'),
  JoiService: Symbol('JoiService'),
  AddressService: Symbol('AddressService'),
  AddressRepository: Symbol('AddressRepository'),
  HandlebarsService: Symbol('HandlebarsService'),
  UserClientRepository: Symbol('UserClientRepository'),
};

const ROLE = {
  RoleService: Symbol('RoleService'),
  RoleRepository: Symbol('RoleRepository'),
};

const USER = {
  UserRepository: Symbol('UserRepository'),
  UserService: Symbol('UserService'),
};

const AUTH = {
  AuthService: Symbol('AuthService'),
};

const TYPES = {
  ...COMMON,
  ...ROLE,
  ...USER,
  ...AUTH,
};

export { TYPES };
