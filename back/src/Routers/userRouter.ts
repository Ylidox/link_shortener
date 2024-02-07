import { checkingUserFields } from '../Middlewares/checkingUserFields';
import { UserController } from './../Controllers/UserController';
import {Router} from "express";

const router = Router();
const userController = new UserController();

router.post('/register', checkingUserFields, userController.registration);
router.post('/login', checkingUserFields, userController.login);

export default router;