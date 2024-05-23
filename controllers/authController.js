const db = require('../data/db');

exports.loginPage = (req, res) => {
    res.render("login", { error: null });
};

exports.authenticate = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.execute("SELECT * FROM users WHERE username = ? AND password = ?", [username, password]);

        if (rows.length > 0) {
            req.session.authenticated = true;
            res.redirect("/");
        } else {
            res.render("login", { error: "Kullanıcı adı veya şifre yanlış" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        } else {
            res.redirect("/login");
        }
    });
};
