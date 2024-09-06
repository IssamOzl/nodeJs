"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const { connectToDb, pool } = require("./db/conn");
require('dotenv').config();
const PORT = Number(process.env.SERVER_PORT) || 3000;
app.use(express_1.default.json());
connectToDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Listening on PORT ", PORT);
        });
    })
    .catch((error) => { console.log(error); process.exit(0); });
