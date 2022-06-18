import path from 'path';
import colors from 'colors';
import * as dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'local';

let envload = dotenv.config({
  path: path.join(__dirname, `../../.env.${env}`),
});

if ((!envload || envload.error) && env !== 'test') {
  console.log(colors.yellow(`Error - ${envload?.error?.message}`));
  console.log(colors.yellow('Checking for .env file'));
  envload = dotenv.config({
    path: path.join(__dirname, `../../.env`),
  });
}

if (!envload || envload.error) {
  console.log(colors.yellow(`No .env file found`));
  console.log(colors.yellow(`Error - ${envload?.error?.message}`));
}

const originsEnv = process.env.ORIGINS;
let origins: string[];
try {
  origins = (originsEnv as string).split(',');
} catch (err) {
  origins = ['http://localhost:3000'];
}

export const databaseSetting = {
  name: process.env.POSTGRES_DATABASE_NAME as string,
  username: process.env.POSTGRES_DATABASE_USERNAME as string,
  password: process.env.POSTGRES_DATABASE_PASSWORD as string,
  host: process.env.POSTGRES_DATABASE_HOST as string,
  dialect: process.env.POSTGRES_DATABASE_DIALECT as string,
  port: parseInt((process.env.POSTGRES_DATABASE_PORT as string) || '5432'),
  synchronize: ['local', 'development', 'dev', 'stage'].includes(env)
    ? process.env.DATABASE_SYNCHRONIZE == 'true'
    : false,
  logging: ['local', 'development', 'dev'].includes(env),
};

export const entities = {
  users: 'users',
  roles: 'roles',
  userRoles: 'user_roles',
};

export enum Role {
  Admin = 'Admin',
  User = 'User',
}

export const emailSetting = {
  testMask: process.env.EMAIL_TEST_MASK as string,
  fromEmail: process.env.EMAIL_FROM_EMAIL as string,
  fromName: process.env.EMAIL_FROM_NAME as string,
  sendGridApi: process.env.SENDGRID_API as string,
  emailEnabled: process.env.EMAIL_ENABLED === 'true',
  newUser: {
    subject: process.env.NEW_USER_EMAIL_SUBJECT || '',
    body: process.env.NEW_USER_EMAIL_BODY || '',
  },
};

export const events = {
  onUserCreate: 'onUserCreate',
};

export default {
  env,
  origins,
  port: process.env.PORT,
  baseUrl: process.env.BASE_URL,
  appName: process.env.APP_NAME || 'Node_TypeORM_API',
  saltRounds: process.env.SALT_ROUNDS || 10,
  log: {
    fileLogLevel: process.env.FILE_LOG_LEVEL,
    dirname: process.env.LOG_DIRNAME || '.logs',
    errorLogFilename: process.env.ERROR_LOG_FILENAME || 'error',
    logLevels: {
      error: 'error',
      warn: 'warn',
      info: 'info',
      verbose: 'verbose',
      debug: 'debug',
      silly: 'silly',
    },
  },
  events: {},
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'accessSecrect',
  accessTokenLife: process.env.ACCESS_TOKEN_LIFE || '15m',
  frontendUrl: process.env.FRONT_END_URL || 'http://localhost:3000',
};
