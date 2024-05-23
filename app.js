const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const config = require('./config/config');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const { sessionTimeoutMiddleware } = require("./middlewares/authMiddleware");

const app = express();

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.static('node_modules'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: "your_secret_code",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 60 * 1000 // 30 dakika
    }
}));

app.use(sessionTimeoutMiddleware);

// Yönlendirmeler
app.use('/', authRoutes);
app.use('/', uploadRoutes);
app.use('/', documentRoutes);

app.listen(config.PORT, function (err) {
    if (err) {
        console.log("An error occurred.");
        return;
    }
    console.log("The server is running on port: " + config.PORT);
});
