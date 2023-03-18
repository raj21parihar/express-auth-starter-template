const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');

router.get('/', authController.home);
router.get('/sign-in', authController.signin);
router.get('/sign-up', authController.signup);
// router.get('/create-user', authController.createUser);
// router.get('/create-session', authController.createSession);

module.exports = router;
