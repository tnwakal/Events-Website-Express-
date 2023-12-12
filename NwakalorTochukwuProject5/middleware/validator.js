const {validationResult} = require('express-validator');
const {body} = require('express-validator');

exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateSignUp = [body('firstName', 'first name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateLogin = [body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    }
    else{
        return next();
    }

}

exports.validateEvent = [body('title', 'Must have a title! Cannot be empty').notEmpty().trim().escape(),
body('content', 'Content must contain at least 10 characters!').isLength({min: 10}).notEmpty().trim().escape(),
body('category', 'Invalid category').optional().isIn(['Gaming', 'Technology', 'Sports', 'Other']),
body('location', 'Must provide a location! Cannot be empty').notEmpty().trim().escape(),
body('startDateTime', 'Invalid start date and time').optional().isISO8601().toDate(),
body('endDateTime', 'Invalid end date and time').optional().isISO8601().toDate(),
body('eventImage', 'Invalid event image URL').optional().isURL(),
body('status', 'Invalid RSVP status').isIn(['YES', 'NO', 'MAYBE']).notEmpty().trim().escape()];