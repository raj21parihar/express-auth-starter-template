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
    '/reset-password',
    passport.checkAuthentication,
    authController.resetPassword
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

module.exports = router;
