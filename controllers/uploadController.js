const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer konfigürasyonu
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, uniqueSuffix + fileExtension);
    }
});

const upload = multer({ storage: storage });

// Upload klasörünün varlığını kontrol et ve oluştur
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

exports.getUploadPage = (req, res) => {
    res.render('upload');
};

exports.uploadFile = upload.single('upload');

exports.uploadFileHandler = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    const funcNum = req.query.CKEditorFuncNum;
    res.send(`<script type="text/javascript">window.parent.CKEDITOR.tools.callFunction(${funcNum}, '${fileUrl}', '');</script>`);
};

exports.deleteFile = (req, res) => {
    const fileName = req.body.fileName;
    const filePath = path.join(__dirname, '../public/uploads', fileName);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Dosya silinemedi:', err);
            return res.status(500).send('Dosya silinemedi');
        }
        console.log('Dosya başarıyla silindi:', fileName);
        res.status(200).send('Dosya başarıyla silindi');
    });
};

exports.listUploads = (req, res) => {
    fs.readdir(path.join(__dirname, '../public/uploads'), (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory: ' + err);
        }
        res.render('uploads', { files: files });
    });
};
