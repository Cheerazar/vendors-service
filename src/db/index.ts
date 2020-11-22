import { Connection, createConnection } from 'typeorm';

let dbConnection: Connection;

export async function getDbConnection(): Promise<Connection> {
  if (dbConnection) {
    return dbConnection;
  }

  try {
    dbConnection = await createConnection();
  } catch (error) {
    throw new Error(error);
  }
  return dbConnection;
}
