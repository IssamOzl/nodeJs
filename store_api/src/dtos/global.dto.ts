import { ValidationError } from "express-validator"

export interface countKeysExists{
    "count_keys":number
}
export interface updateQueryRes{
    "affectedRows":number
}
export interface insertQueryRes{
    "insertId":number,
    "affectedRows":number
}
export type activeInDb ="active"
export type inactiveInDb ="inactive"
export type activeOrNot= activeInDb|inactiveInDb
export interface validationErrorArray{
     "Errors":ValidationError[]
}
export interface dbError{
    "message":string,
    "code":string,
    "errno":number
}
export interface dbErrorReturn{
    "Errors":dbError
}