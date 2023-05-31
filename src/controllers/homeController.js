import db from "../models/index";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();

        return res.render("homepage.ejs", {
            data: JSON.stringify(data),
        });
    } catch (e) {
        console.log(e);
    }
};

let getCRUD = (req, res) => {
    return res.render("crud.ejs");
};
let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    return res.send("post crud from controller");
};
let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    // console.log("--------------------------------");
    // console.log(data);
    // console.log("--------------------------------");
    return res.render("displayCRUD.ejs", {
        dataTable: data,
    });
};

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        // console.log("------------------------------------------");
        // console.log(userData);
        // console.log("------------------------------------------");
        return res.render("editCRUD.ejs", {
            user: userData,
        });
    } else {
        return res.send("user not found");
    }
};

let putCRUD = async (req, res) => {
    let data = req.body;
    await CRUDService.updateUserData(data);
    return res.redirect("/get-crud")
};

module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
};
