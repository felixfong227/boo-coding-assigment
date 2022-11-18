
import { MongoMemoryServer } from 'mongodb-memory-server';

let db: MongoMemoryServer;
export async function mongoDB() {
    if(db) return db;
    const mongod = await MongoMemoryServer.create();
    console.info('Creating a new in-memory MongoDB instance');
    db = mongod;
    return db;
}