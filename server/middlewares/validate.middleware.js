import {  ZodError } from "zod";


export const validate = (schema) => async (req ,res, next) =>{
    try {
        await schema.parseAsync(req.body);  // async parsing for possible asycn checks
        next(); // if vaildtion is good , proceed to next middleware/controller
    } catch (error) {
        if ( error instanceof ZodError){
            // there is a ZodError , so what i am doing here is formatting it for better understanding
            const formatErrors = error.errors.map((err)=>({
                field : err.path.join("."),
                message:err.message
            }))
            return res.status(400).json({errors: formatErrors})
        }
        next(error)

    }
}
