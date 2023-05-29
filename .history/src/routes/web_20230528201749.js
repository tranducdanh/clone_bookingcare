import express from 'express';

let router = express.router();

let initWebRoutes = (app) =>{
    return app.use("/", routes)
}

module.exports = initWebRoutes