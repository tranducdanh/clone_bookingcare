let getHomePage = (req, res) => {
    return res.re('helo world from homecontroller')
};

module.exports = {
    getHomePage: getHomePage,
};
