import { Request, Response} from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HTTPValidationError } from "../HTTPValidationError/HTTPValidationError";
import { TypeError } from "../HTTPValidationError/ValidationError";
import {pool} from '../db'
import dotenv from 'dotenv';

dotenv.config()

const generateToken = (username: string) => {
  const payload = {username}
  return jwt.sign(payload, process.env.SECRET_KEY || 'secret_key', {expiresIn: '24h'});
}

export class UserController{
  async registration(req: Request, res: Response){
    let {username, password} = req.body;

    let customer = await pool.query('select * from customer where customer.username = $1', [username]);
    if(customer.rows.length){
      res.status(422).json(new HTTPValidationError(req.originalUrl, "Пользователь уже существует", TypeError.AUTH_ERROR));
      return;
    }
    const hashPassword = bcrypt.hashSync(password, 5);
    
    await pool.query(`insert into customer (username, password) values ($1,$2)`, [username, hashPassword]);

    const token = generateToken(username);

    res.status(200).json({
      access_token: token,
      token_type: "bearer"
    });
  }
  async login(req: Request, res: Response){
    let {username, password} = req.body;

    let user = await pool.query('select * from customer where username=$1', [username]);
    if(!user.rows.length) {
      res.status(422).json(new HTTPValidationError(req.originalUrl, "Пользователя не существует", TypeError.AUTH_ERROR));
      return;
    }

    let hashPassword = user.rows[0].password;
    if(!bcrypt.compareSync(password, hashPassword)){
      res.status(422).json(new HTTPValidationError(req.originalUrl, "Пароль не верен", TypeError.AUTH_ERROR));
      return;
    }

    const token = generateToken(username);

    res.status(200).json({
      access_token: token,
      token_type: "bearer"
    });
  }
}
