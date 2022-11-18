'use strict';

import express from 'express';
import profileRouter from './routes/profile';
const app = express();
const port =  process.env.PORT || 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// routes
app.use('/', profileRouter);

// start server
app.listen(port);
console.log('Express started. Listening on %s', port);
