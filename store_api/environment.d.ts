declare global {
    namespace NodeJS {
      interface ProcessEnv {
        SERVER_PORT:number
        DB_HOST:string
        DB_PORT:number
        DB_USER:string
        DB_PASSWORD:string
        DB_NAME:string
        MAX_REQ_NUM :number
        SECRET_KEY :string
        SECRET_IV :string
        NODE_ENV:"prod"|"dev"
        MAX_REQ_BY_IP : number
        MAX_REQ_BY_IP_ADD_ORDER : number
      }
    }
  }
  
  export {}