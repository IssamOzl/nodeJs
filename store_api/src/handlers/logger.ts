import { format, transports, createLogger } from 'winston';
import dotenv from 'dotenv';
import { FileTransportInstance } from 'winston/lib/winston/transports';
dotenv.config();

// logger transport
let loggerTransport = [
    new transports.File({
        level: "warn",
        filename: "logs/" + new Date().toISOString().split('T')[0] + "/warn.log"
    }),
    new transports.File({
        level: "error",
        filename: "logs/" + new Date().toISOString().split('T')[0] + "/error.log"
    }),
]
let myErrorLoggerTransport: any = [
    new transports.File({
        level: "error",
        filename: "logs/" + new Date().toISOString().split('T')[0] + "/inernal_errors.log"
    })
]
let inofosLoggerTransport: any = [
    new transports.File({
        level: "info",
        filename: "logs/" + new Date().toISOString().split('T')[0] + "/infos.log"
    })
]

if (process.env.NODE_ENV !== "prod") {
    inofosLoggerTransport.push(
        new transports.Console()
    )
}
export const logger = createLogger({
    transports: loggerTransport,
    format: format.combine(
        format.json(),
        format.timestamp(),
        format.prettyPrint(),
        format.metadata()
    )
})
export const myErrorLogger = createLogger({
    transports: myErrorLoggerTransport,
    format: format.combine(
        format.timestamp(),
        format.json(),
        format.prettyPrint(),
        format.printf(({ level, meta, timestamp, message, code, sql, sqlMessage }) => {
            let errorMessage: string = `${timestamp} ${level} :`
            if (meta) {
                errorMessage += " " + meta.message
            }
            if (sql) {
                errorMessage += `
DB ERROR :
sql: ${message}
level: ${level}
code: ${code}
sqlMessage: ${sqlMessage}  `
            }
            return errorMessage
        })
    )
})


export const infosLogger = createLogger({
    transports: inofosLoggerTransport,
    format: format.combine(
        format.json(),
        format.timestamp(),
        format.prettyPrint(),
        format.metadata()
    )
})