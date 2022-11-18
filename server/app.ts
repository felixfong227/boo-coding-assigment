'use strict';

import express from 'express';
import mongoose from 'mongoose';
import profileRouter from './routes/profile';
import { mongoDB } from './utils/db';
import userSeed from './seed/users';
import bodyParser from 'body-parser';

async function main() {
    const app = express();
    const port =  process.env.PORT || 3000;
	
    // set the view engine to ejs
    app.set('view engine', 'ejs');
	
    const db = await mongoDB();
    const dbUrl = db.getUri();
    await mongoose.connect(dbUrl);
    console.info(`Connected to ${dbUrl}`);
    
    await userSeed();
    
    app.use(bodyParser.json());
    
    // routes
    app.use('/', profileRouter);
	
    // start server
    app.listen(port);
    console.log('Express started. Listening on %s', port);
}
main();