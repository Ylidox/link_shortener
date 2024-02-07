import { LinkController } from '../Controllers/LinkController';
import { auth } from '../Middlewares/auth';
import { checkingUserFields } from '../Middlewares/checkingUserFields';
import {Router} from "express";

const router = Router();
const linkController = new LinkController();

router.post('/squeeze', auth, linkController.squeeze);
router.get('/count', auth, linkController.count);
router.get('/statistics', auth, linkController.statistics);

export default router;