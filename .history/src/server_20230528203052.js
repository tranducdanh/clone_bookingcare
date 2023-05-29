import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine'
import initWebRoutes from './routes/web'

let app = express()

//config app

app.use(bodyParser.json())

viewEngine(app)
initWebRoutes(app)
