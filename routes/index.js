const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const passport = require('passport');

router.get('/', passport.checkAuthentication, authController.home);
router.get('/sign-in', authController.signin);
router.get('/sign-up', authController.signup);

router.post('/create-user', authController.createUser);
router.post(
    '/create-session',
    passport.authenticate('local', { failureRedirect: '/sign-in' }),
    authController.createSession
);
router.get('/sign-out', authController.destroySession);
router.get(
    '/change-password',
    passport.checkAuthentication,
    authController.changePassword
);
router.post(
    '/update-password',
    passport.checkAuthentication,
    authController.updatePassword
);

router.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/sign-in' }),
    authController.createSession
);

router.get('/forgot-password', authController.forgotPassword);
router.post('/send-reset-link', authController.sendPasswordResetLink);
router.get('/reset-password', authController.resetPassword);
router.post('/set-new-password', authController.verifyAndSetNewPassword);

module.exports = router;
