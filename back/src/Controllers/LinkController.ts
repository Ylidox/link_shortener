import { Request, Response} from "express";
import { HTTPValidationError } from "../HTTPValidationError/HTTPValidationError";
import { TypeError } from "../HTTPValidationError/ValidationError";
import {pool} from '../db';

enum Order {
  'asc_target',
  'asc_short',
  'asc_counter',
  'desc_short' ,
  'desc_target',
  'desc_counter',
};
type TypeKeyOrder = keyof typeof Order;

const makeShortURL = (len: number = 5) => {
  const random = (min: number, max: number) => {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }
  const str = 'qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM0123456789';
  let out = '';
  for(let i = 0; i < len; i++){
    out += str[random(0, str.length - 1)];
  }
  return out;
}

export class LinkController{
  async squeeze(req: Request, res: Response){
    const {username, user_id} = req.body.user;
    const {link} = req.body;

    try{
      new URL(link);
    }catch(err){
      res.status(422).json(new HTTPValidationError(req.originalUrl, `Ссылка: ${link} не валидна`, TypeError.LINK_ERROR));
      return;
    }

    const link_db = await pool.query(`
      select link.id, customer_id, short_link, target_link, click_counter
      from link where customer_id = $1 and target_link = $2;`, [user_id, link]);
    
    if(link_db.rows.length){
      res.status(422).json(new HTTPValidationError(req.originalUrl, `Ссылка: ${link} уже сокращалась`, TypeError.LINK_ERROR));
      return;
    }

    let short_link: string = '';

    while(true){
      short_link = makeShortURL();

      const link_db = await pool.query(`
        select * from link where short_link = $1
      `, [short_link]);

      if(!link_db.rows.length) break;
    }

    await pool.query('insert into link(customer_id, target_link, short_link) values ($1, $2, $3)', [user_id, link, short_link]);
    
    let result_row = await pool.query('select * from link where short_link = $1', [short_link]);
    let result = result_row.rows[0];

    res.status(200).json({
      id: result.id,
      short: result.short_link,
      target: result.target_link,
      counter: result.click_counter,
    });
  }

  async redirect(req: Request, res: Response){
    let {key} = req.params;
    let link_db = await pool.query('select * from link where short_link = $1', [key]);
    if(!link_db.rows.length){
      res.status(422).json(new HTTPValidationError(req.originalUrl, `Не существует такой ссылки`, TypeError.LINK_ERROR))
      return;
    }

    await pool.query('update link set click_counter=click_counter+1 where short_link = $1', [key]);

    let target_row = await pool.query('select target_link from link where short_link=$1', [key]);
    let target_link = target_row.rows[0].target_link;
    
    res.status(307).redirect(target_link);
  }

  async statistics(req: Request, res: Response){
    let {order, offset, limit} = req.query;
    
    if(typeof order === 'string') order = [order];

    const statisticSQLBuilder = new StatisticSQLBuilder();
    statisticSQLBuilder.setCustomerId(req.body.user.user_id);

    const isStringArray = (arr: any): arr is string[] => {
      return Array.isArray(arr) && arr.every((item) => typeof item === 'string');
    }

    const isOrder = (value: string): value is TypeKeyOrder => {
      return Object.values(Order).includes(value as TypeKeyOrder);
    }

    if(isStringArray(order)){
      for(let field of order){
        if(isOrder(field)){
          statisticSQLBuilder.pushOrder(field);
        }
      }
    }
    
    if(typeof limit === 'string' && !Number.isNaN(+limit)) statisticSQLBuilder.setLimit(+limit);

    if(typeof offset === 'string' && !Number.isNaN(+offset)) statisticSQLBuilder.setOffset(+offset);

    let links = await pool.query(statisticSQLBuilder.get());
    res.status(200).json(links.rows);
  }

  async count(req: Request, res: Response){
    try{
      const { user_id} = req.body.user;
      let out = await pool.query(`
        SELECT COUNT(*) as total_rows
        FROM link
        WHERE customer_id=$1;
      `, [user_id]);
      res.status(200).json(out.rows[0]);
    }catch(err){
      res.status(422).json(new HTTPValidationError(req.originalUrl, 'Не выходит найти количество записей', TypeError.LINK_ERROR))
    }
  }
}

class StatisticSQLBuilder{
  private orders: TypeKeyOrder[];
  private offset: number;
  private limit: number;
  private customer_id: number;
  constructor(){
    this.orders = [];
    this.offset = 0;
    this.limit = 0;
    this.customer_id = 0;
  }
  setCustomerId(id: number){
    this.customer_id = id;
    return this;
  }
  setOffset(offset: number){
    this.offset = offset;
    return this;
  }
  setLimit(limit: number){
    this.limit = limit;
    return this;
  }
  pushOrder(order: TypeKeyOrder){
    this.orders.push(order);
    return this;
  }
  get(){
    let out = 'select * from link ';

    if(this.customer_id){
      out += `where customer_id = ${this.customer_id} `
    }

    const actions: {[key in TypeKeyOrder]: string} = {
      asc_short: 'short_link asc',
      asc_target: 'target_link asc',
      asc_counter: 'click_counter asc',
      desc_short: 'short_link desc',
      desc_target: 'target_link desc',
      desc_counter: 'click_counter desc',
    }

    if(this.orders.length) out += 'order by '
    for(let order of this.orders){
      out += `${actions[order]},`
    }
    if(this.orders.length) out = out.substring(0, out.length - 1);

    out += ` limit ${this.limit || 'all'} offset ${this.offset};`;
  

    return out;
  }
}