import express from "express";
import  homeController  from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/",homeController.getHomePage());

    // rest api
    router.get("/danh", (req, res) => {
        return res.send("hello world with danh");
    });

    return app.use("/", router);
};

module.exports = initWebRoutes;