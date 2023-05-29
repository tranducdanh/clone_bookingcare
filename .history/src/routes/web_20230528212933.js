import express from "express";
import { getHomePage } from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", (req, res) => {
        return res.send("hello world with DucDanh");
    });

    // rest api
    router.get("/danh", (req, res) => {
        return res.send("hello world with danh");
    });

    return app.use("/", router);
};

module.exports = initWebRoutes;
