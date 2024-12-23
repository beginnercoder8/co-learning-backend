const express = require('express');
const router = express.Router();
const { createAccount,login } = require('../controller/auth.controller');
router.route("/login").post(login);
router.route("/admin/create-account").post(createAccount);
module.exports = router;