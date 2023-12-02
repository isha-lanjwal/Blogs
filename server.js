import  serverConfig  from './constants/serverConfig.js';
import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import {connectDb}  from './schema/index.js';
import  routes  from './routes/index.js';
import passport from 'passport';
import './middleware/passport.js';
const app = express();
const PORT = process.env.PORT || serverConfig.port;
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors());
app.set('port', PORT);
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'accept, authorization, content-type, X-XSRF-TOKEN');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});
app.use(passport.initialize());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(serverConfig.baseUrl + 'auth', routes.auth);
const authCheck =  passport.authenticate('jwt', { session: false });
app.use(serverConfig.baseUrl + 'user',authCheck, routes.user);
app.use(serverConfig.baseUrl + 'blog',authCheck,routes.blog);
app.use(serverConfig.baseUrl + 'blog_ratings',authCheck,routes.blog_rating);
app.use(serverConfig.baseUrl + '',routes.public_blog);
app.use(serverConfig.baseUrl + '',routes.public_blog_rating);
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