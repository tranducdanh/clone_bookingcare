import express from 'express';

let router = express.Router();

let initWebRoutes = (app) =>{

    router.get('/', (req, res) =>{
        return res.send('hello world with DucDanh')
    }) 

    // rest api
    router.get('/', (req, res) =>{
        return res.send('hello world with DucDanh')
    }) 

    return app.use("/", router)
}

module.exports = initWebRoutes