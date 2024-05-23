const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/admin", documentController.adminPage);
router.post("/admin/delete-document/:documentID", documentController.deleteDocument);
router.post("/admin/update-document/:documentID", documentController.updateDocument);
router.post("/admin/add-document", documentController.addDocument);
router.get("/:documentLink", documentController.documentDetails);
router.get("/", documentController.indexPage);

module.exports = router;
