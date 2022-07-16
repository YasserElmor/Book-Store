exports.get404 = (req, res, next) => {
    res.status(404).render("errors/404", {
        pageTitle: "404 Not Found!",
        path: "/404",
    });
};

exports.get500 = (req, res, next) => {
    res.status(500).render("errors/500", {
        pageTitle: "An unexpected error occured!",
        path: "/500"
    });
};