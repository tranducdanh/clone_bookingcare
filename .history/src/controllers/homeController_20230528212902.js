let getHomePage = (req, res) => {
    return res.send('helo world from homecontroller')
};

module.exports = {
    getHomePage: getHomePage,
};
