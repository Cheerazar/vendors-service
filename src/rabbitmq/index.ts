import { createConnection } from './createConnection';

export async function setUpRabbit() {
  try {
    const connection = await createConnection();
  } catch (error) {
    console.log(`Error initializing RabbitMQ: ${error.message}`);
    throw error;
  }
}
