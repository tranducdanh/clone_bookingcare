import express from 'express';

let configViewEngine = (app) =>{
    app.use(express.static())
}

module.exports = configViewEngine