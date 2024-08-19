import { ValidationError } from "express-validator"

export interface countKeysExists{
    "count_keys":number
}
export interface updateQueryRes{
    "affectedRows":number
}
export interface insertQueryRes{
    "insertId":number
}
export type activeOrNot= "active"|"inactive"
export interface validationErrorArray{
     "Errors":ValidationError[]
}
export interface dbError{
    "message":string,
    "code":string,
    "errno":number
}
export interface dbErrorReturn{
    "error":dbError
}