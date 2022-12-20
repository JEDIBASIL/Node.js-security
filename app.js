import dotenv from "dotenv"
import { connectDB } from "./Config/dbConnection"
import express, { json } from "express"
import faqRouter from "./Routes/faq";
import userRouter from "./Routes/user"
import cors from "cors"
import cookieParser from "cookie-parser";
dotenv.config({ path: './Config/config.env' });

connectDB();


const app = express();

app.use(express.urlencoded({extended:false}))

app.use(cookieParser())

app.use(json())

app.use(cors({credentials: true, origin: 'http://127.0.0.1:3000'}));




const PORT = process.env.PORT || 5000;


app.use("/api/v1/faq", faqRouter)
app.use("/api/v1/user", userRouter)







app.listen(PORT,()=>{
    console.log("app listening on "+PORT)
})