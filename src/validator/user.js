const {body} = require('express-validator')

const registerValidator = [
     body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be text")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .escape(),
  body("email")
    .isEmail()
    .withMessage("Please use a valid Email Address")
    .notEmpty()
    .withMessage("Email is Required")
    .normalizeEmail(),
     body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
    })
    .withMessage(
      "Password must be at least 10 characters long and include upper, lower, and numbers.",
    ),
  body("age")
    .exists()
    .withMessage("Age is required")
    .isNumeric()
    .withMessage("Age must be a number")
    .isInt({ min: 18, max: 120 })
    .withMessage("Age must be between 18 and 120")
    .toInt(),
  body("gender")
    .trim()
    .isIn(["male", "female", "other", "prefer-not-to-say"])
    .withMessage("Please select a valid gender option")
    .optional(),
];

const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Please use a valid Email Address")
    .notEmpty()
    .withMessage("Email is Required")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password must not be empty"),
];

module.exports = { registerValidator, loginValidator }