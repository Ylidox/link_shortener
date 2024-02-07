import { Request, Response, NextFunction} from "express"
import { HTTPValidationError } from "../HTTPValidationError/HTTPValidationError";
import { TypeError } from "../HTTPValidationError/ValidationError";

export const checkingUserFields = (req: Request, res: Response, next: NextFunction) => {
  let {username, password} = req.body;

  if(!username){
    res.status(422).json(new HTTPValidationError(req.originalUrl, "Отсутствует логин", TypeError.AUTH_ERROR));
    return;
  }
  if(!password){
    res.status(422).json(new HTTPValidationError(req.originalUrl, "Отсутствует пароль", TypeError.AUTH_ERROR));
    return;
  }

  next();
}