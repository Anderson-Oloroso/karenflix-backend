import { validationResult } from "express-validator";

export default function validationMiddleware(
    req,
    res,
    next
){
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return  res.status(400).json({
            status: "Fail",
            messafe: "Error de validacion ...",
            errors: errors.array()
        });
    }
    next();
}