import { Router } from 'express';
import { getPrijateObjednavky } from '../controllers/ordersController.js';

const ordersRouter = Router();

ordersRouter.get('/objednavky/prijate', getPrijateObjednavky);

export default ordersRouter;
