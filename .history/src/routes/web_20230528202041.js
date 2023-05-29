import express from 'express';

let router = express.Router();

let initWebRoutes = (app) =>{

    router.get('/', (req, res) =>{
        
    }) 
    return app.use("/", router)
}

module.exports = initWebRoutes