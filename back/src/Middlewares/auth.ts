import { Request, Response, NextFunction } from 'express';
import { HTTPValidationError } from "../HTTPValidationError/HTTPValidationError";
import { TypeError } from "../HTTPValidationError/ValidationError";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../db';

dotenv.config()

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const token = req.headers.authorization || '';
    if(!token){
      throw new Error();
    }
    const decodedData = jwt.verify(token, process.env.SECRET_KEY || "secret_key");
    req.body.user = decodedData;

    const user = await pool.query(`select id from customer where username = $1`, [req.body.user.username]);
    req.body.user.user_id = user.rows[0].id;

    next();
  }
  catch(err){
    res.status(422).json(new HTTPValidationError(req.originalUrl, "Неверный токен", TypeError.AUTH_ERROR));
  }
}