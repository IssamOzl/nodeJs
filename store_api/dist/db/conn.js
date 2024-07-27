"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
require('dotenv').config();
const access = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    password: process.env.DB_PASSWORD
};
const pool = promise_1.default.createPool(access);
const connectToDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pool.getConnection();
        console.log("Connect to db succesfully");
    }
    catch (error) {
        console.log("Error while connecting to DB", error);
        throw error;
    }
});
module.exports = { pool, connectToDb };
