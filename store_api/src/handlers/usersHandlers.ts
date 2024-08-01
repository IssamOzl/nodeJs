import { Request, Response } from "express";
import { userIdParam } from "../dtos/users.dto";
import { api_key_to_user } from "../db/usersQueries";

export async function generate_api_key(request:Request<{},{},userIdParam>,response:Response) {
    try {
        const reqBody:userIdParam = request.body
        // TODO: validation

        if(reqBody){
            const [key,hashedKey]  = await api_key_to_user(reqBody.user_id,reqBody.host)
            
            // success
            if(key != null && hashedKey != null){
                response.status(200).send([key,hashedKey])
            }else{
                response.status(500).send("Internal server error or user not found")
            }
        }else{
            response.status(400).send("Missing parameter : user_id")
        }
    } catch (error) {
        response.sendStatus(500)
    }
}