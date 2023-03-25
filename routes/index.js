// Import required modules
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const passport = require('passport');

// Define routes and their corresponding handlers
router.get('/', passport.checkAuthentication, authController.home); // Home page, accessible only to authenticated users
router.get('/sign-in', authController.signin); // Signin page
router.get('/sign-up', authController.signup); // Signup page

router.post('/create-user', authController.createUser); // Create a new user

router.post(
    '/create-session',
    passport.authenticate('local', {
        failureRedirect: '/sign-in',
        failureFlash: true,
    }),
    authController.createSession
); // Create a new session for the user after authentication

router.get('/sign-out', authController.destroySession); // Destroy the current session

router.get(
    '/change-password',
    passport.checkAuthentication,
    authController.changePassword
); // Page to change the password, accessible only to authenticated users

router.post(
    '/update-password',
    passport.checkAuthentication,
    authController.updatePassword
); // Endpoint to update the password, accessible only to authenticated users

router.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
); // Endpoint to authenticate using Google OAuth

router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/sign-in' }),
    authController.createSession
); // Callback URL for Google OAuth authentication

router.get('/forgot-password', authController.forgotPassword); // Forgot password page
router.post('/send-reset-link', authController.sendPasswordResetLink); // Send password reset link to the user's email
router.get('/reset-password', authController.resetPassword); // Page to reset the password using a reset link
router.post('/set-new-password', authController.verifyAndSetNewPassword); // Set a new password after verifying the reset link

// Export the router module
module.exports = router;
