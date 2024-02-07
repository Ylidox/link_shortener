import express from "express";
import dotenv from 'dotenv';
import userRouter from './Routers/userRouter'
import linkRouter from './Routers/linkRouter'
import { LinkController } from "./Controllers/LinkController";

dotenv.config()

let app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', userRouter);
app.use('/api', linkRouter);
app.get('/s/:key', new LinkController().redirect);

app.listen(PORT, () => console.log(`Server starting on port ${PORT}`));
