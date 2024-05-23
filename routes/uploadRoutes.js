const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");

router.get('/upload', uploadController.getUploadPage);
router.post('/upload', uploadController.uploadFile, uploadController.uploadFileHandler);
router.post('/delete-file', uploadController.deleteFile);
router.get('/uploads', uploadController.listUploads);

module.exports = router;
