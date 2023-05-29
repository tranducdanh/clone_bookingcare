import express from 'express';
import bodyParser from 'body-parser';
import configViewEngine from './config/viewEngine'
import initWebRoutes from './routes/web'

let app = express()

//config app

configViewEngine(app)
ini