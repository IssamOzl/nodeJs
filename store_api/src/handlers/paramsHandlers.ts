import { Request, Response } from "express";
import { find } from "../db/paramsQueries";
import { params, getParamByName, getParamByNameVal } from "../dtos/params.dto";
import { Send } from "express-serve-static-core";


export async function getParams(request:Request,response:Response<params>){
    try {
        const params:params = await find()
        if(params){
            return response.send(params)
        }else{
            return response.status(500)
        }
        
    } catch (error) {
        //throw error
        return response.status(500)
    }

    
}

// export async function getParamByName(request:Request<{},{},getParamByName>,response:Response<getParamByNameVal>){
//     try {
        
//         // TODO : verify the param
//         const paramToGet:getParamByName = request.body
//         const val:getParamByNameVal = await findByName(paramToGet)
//         if(val){
//             return response.status(200).send(val)
//         }else{
//             return response.status(404)
//         }

//     } catch (error) {
//         throw error
//     }
// }