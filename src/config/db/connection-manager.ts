import { createConnection, Connection } from 'typeorm';

import connectionConfig from './ormconfig';

export const connection = (): Promise<Connection> => {
  return createConnection(connectionConfig);
};
