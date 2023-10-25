import  serverConfig  from '../demo/constants/serverConfig.js';
import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
// const mongoose = require('mongoose');
import {connectDb}  from './schema/index.js';
import  routes  from './routes/index.js';
const app = express();
const PORT = process.env.PORT || serverConfig.port;
app.use(cors());
app.set('port', PORT);
app.use(bodyParser.json({ limit: '20mb' }));
app.use(serverConfig.baseUrl + 'auth', routes.auth);

connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Database connection is Ready "
                + "and Server is Listening on Port ", PORT);
        })
    })
    .catch((err) => {
        console.log("A error has been occurred while"
            + " connecting to database.");
    })

//Connection to the mongodb database
// mongoose.connect('mongodb://localhost:27017/demo')
// .then(()=>{
//     app.listen(PORT, ()=>{
//         console.log("Database connection is Ready "
//         + "and Server is Listening on Port ", PORT);
//     })
// })
// .catch((err)=>{
//     console.log("A error has been occurred while"
//         + " connecting to database.");   
// })

export default app;