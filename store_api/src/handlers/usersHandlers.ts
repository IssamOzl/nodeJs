import { Request, Response } from "express";
import { userIdParam } from "../dtos/users.dto";
import { api_key_to_user } from "../db/usersQueries";
import { body, validationResult } from "express-validator";
import { formatDbErrorMessage } from "../utils/helper";

//    "user_id":number "host":string
export const generate_api_key_validation = [
    body("user_id")
        .trim().notEmpty().withMessage("Missing body parameter user_id")
        .isInt({min:1}).withMessage("user_id must be an integer >= 1"),
    body("host")
        .optional()
        .isString().withMessage("host parameter must be a string")
        .isLength({min:10}).withMessage("host parameter must be at least 10 carracters long")
]

export async function generate_api_key(request:Request<{},{},userIdParam>,response:Response) {
    try {

        const resValidation = validationResult(request)
        if( !resValidation.isEmpty() ){
           return response.status(400).send({"Errors":resValidation.array()} );
        }

        const reqBody:userIdParam = request.body
        const [key,hashedKey]  = await api_key_to_user(reqBody.user_id,reqBody.host)
        // success
        if(key != null && hashedKey != null){
            return  response.status(200).send([key,hashedKey])
        }else{
            return  response.status(500).send("Internal server error or user not found")
        }
 
    } catch (error) {
        return response.status(500).send(formatDbErrorMessage(error))
    }
}