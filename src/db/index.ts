import { Connection, createConnection } from 'typeorm';

let dbConnection: Connection;

export async function getDbConnection(): Promise<Connection> {
  if (dbConnection) {
    return dbConnection;
  }

  dbConnection = await createConnection();
  return dbConnection;
}
