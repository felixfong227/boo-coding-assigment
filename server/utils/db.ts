
import { MongoMemoryServer } from 'mongodb-memory-server';

export async function mongoDB(): Promise<MongoMemoryServer> {
    const mongo = await MongoMemoryServer.create();
    console.info('Creating a new in-memory MongoDB instance');
    return mongo;
}