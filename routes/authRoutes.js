const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/login", authController.loginPage);
router.post("/login", authController.authenticate);
router.post("/logout", authController.logout);

module.exports = router;
