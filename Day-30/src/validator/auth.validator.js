import { validationResult, body } from "express-validator";

const validate = (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) return next()
        else return res.status(400).json({ errors: errors.array() })
    }

export const registerUserValidation = [
    body("username").isString().withMessage("username should be in string"),
    body("email").isEmail().withMessage("email should be in email format"),
    body("password").custom((value)=>{
        if(value.length < 8) throw new Error("Password should be at least 8 characters long");

        const regex = /^(?=.*[a-z])(?=.*[A-Z]).+$/;
        if(!regex.test(value)) throw new Error("Password should contain at least one uppercase and one lowercase letter");

        return true;
    }),
    validate
]