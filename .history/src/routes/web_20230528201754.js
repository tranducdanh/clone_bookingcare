import express from 'express';

let router = express.router();

let initWebRoutes = (app) =>{
    return app.use("/", router)
}

module.exports = initWebRoutes