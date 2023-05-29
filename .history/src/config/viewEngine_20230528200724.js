import express from 'express';

let configViewEngine = (app) =>{
    app.use(express.static('./src/pu'))
}

module.exports = configViewEngine