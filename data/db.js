const mysql = require('mysql2/promise');

// Veritabanı bağlantı ayarlarını burada tanımlayın
const config = {
    host: 'localhost',   // Veritabanı sunucusunun adresi
    user: 'your_username',        // Veritabanı kullanıcısı
    password: 'your_password', // Veritabanı şifresi
    database: 'your_database', // Veritabanı adı
};

const pool = mysql.createPool(config);

module.exports = pool;
