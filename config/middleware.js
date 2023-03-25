// middleware to use the connect flash.
module.exports.setFlash = function (req, res, next) {
    // Set res.locals.flash to an object containing success and error messages from flash
    res.locals.flash = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    // Call the next middleware function in the chain
    next();
};

/*This code exports a middleware function called setFlash that is used to set the res.locals.flash object.
The res.locals object is an object that contains response local variables that are passed to the view for rendering.
In this middleware, the res.locals.flash object is set to an object containing success and error messages from flash messages
that were set in previous middleware functions. req.flash() is a function provided by the connect-flash middleware that allows
you to store and retrieve flash messages.
Finally, the next() function is called to pass control to the next middleware function in the chain.*/
