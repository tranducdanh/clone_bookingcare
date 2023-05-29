let getHomePage = (req, res) => {
    return res.render('helo world from homecontroller')
};

module.exports = {
    getHomePage: getHomePage,
};
