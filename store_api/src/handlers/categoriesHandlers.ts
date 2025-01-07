import { Request, Response } from "express";
import { categories } from "../dtos/categories.dto";
import { find, findById } from "../db/categoriesQueries"
import { formatDbErrorMessage } from "../utils/helper";
import { dbErrorReturn, validationErrorArray } from "../dtos/global.dto";
import { query, validationResult } from "express-validator";

export async function getCategories(request: Request, response: Response<categories[] | dbErrorReturn>) {
    try {
        const cats: categories[] = await find()
        if (cats) {
            return response.status(200).json(cats)
        } else {
            return response.status(404).json(cats)
        }

    } catch (error) {
        return response.status(500).json(formatDbErrorMessage(error))
    }
}

export async function getActiveCategories(request: Request, response: Response<categories[] | dbErrorReturn>) {
    try {
        const cats: categories[] = await find(false)
        if (cats) {
            return response.status(200).json(cats)
        } else {
            return response.status(404).json(cats)
        }

    } catch (error) {
        return response.status(500).json(formatDbErrorMessage(error))
    }
}
export const getCategoryDetails_validation = [
    query("id")
        .notEmpty().withMessage("id not passed")
        .isInt({ min: 1 }).withMessage("id must be a positive integer")
]
export async function getCategoryDetails(request: Request, response: Response<categories | dbErrorReturn | validationErrorArray>) {
    const resValidation = validationResult(request)
    if (!resValidation.isEmpty()) {
        return response.status(400).json({ "Errors": resValidation.array() });
    }

    try {
        const id = request.query.id as unknown as number
        const category: categories = await findById(id)
        return response.status(200).json(category) 
    } catch (error) {
        return response.status(500).json(formatDbErrorMessage(error))

    }
}