import express from "express"
import App from "./src/services/ExpressApp"
import dbConnection from "./src/services/dbConnection"

const startServer = async()=>{
    const app =express()
    
    dbConnection()

    await App(app)

     app.listen(8000,()=>{
        console.log('server is running on port 8000');
        
    })
}

startServer()