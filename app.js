// Import necessary modules / Gerekli modüller import edilir
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

// Set EJS as the view engine / Görünüm motoru olarak EJS'yi ayarlanır
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// Serve static files from 'public' and 'node_modules' directories / 'public' ve 'node_modules' dizinlerinden statik dosyalar alınır
app.use(express.static('public'));
app.use(express.static('node_modules'));

// Configure body-parser to parse URL-encoded and JSON request bodies / body-parser, URL-encoded ve JSON istek gövdelerini ayrıştıracak şekilde yapılandırılır
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure session middleware / Oturum (session) ara yazılı yapılandırılır
app.use(session({
    secret: "your_secret_code", // Secret key for session / Oturum için gizli anahtar
    resave: false, // Do not save session if unmodified / Değiştirilmemişse oturumu kaydetme
    saveUninitialized: false, // Do not create session until something is stored / Bir şey saklanana kadar oturum oluşturma
    cookie: {
        maxAge: 30 * 60 * 1000 // Session duration set to 30 minutes / Oturum süresi 30 dakika olarak ayarlanır
    }
}));

// Use middleware to handle session timeout / Oturum süresini yönetmek için kullanılan ara yazılım
app.use(sessionTimeoutMiddleware);

// Define routes / Rotalar tanımlanır
app.use('/', authRoutes); // Authentication routes / Kimlik doğrulama rotaları
app.use('/', uploadRoutes); // File upload routes (CkEditor was developed for the image upload tool.) / Dosya yükleme rotaları (CkEditor resim yükleme aracı için geliştirilmiştir.)
app.use('/', documentRoutes); // Document routes / Döküman rotaları

// Start the server / Sunucuyu başlat
app.listen(config.PORT, function (err) {
    if (err) {
        console.log("An error occurred."); // Log an error if it occurs / Bir hata meydana gelirse kaydet
        return;
    }
    console.log("The server is running on port: " + config.PORT); // Log the server running status / Sunucu çalışma durumunu kaydet
});
