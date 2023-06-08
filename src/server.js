import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine';
import initWebRoutes from './routes/web';
import connectDB from './config/connectDB';
import cors from 'cors';

require('dotenv').config();

let app = express();
// app.use(cors({ origin: true }));
app.use(cors({ credentials: true, origin: true }));

//config app

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 8082;

/*const server =*/ app.listen(port, () => {
    console.log('backend nodejs running on the port: ' + port);
});

// process.on('unhandledRejection',err=>{
//     console.log(`error: ${err.message}`);
//     console.log('Shutting down server due to Unhandled Rejection');
//     server.close(()=>{
//         process.exit(1);
//     });

// })
