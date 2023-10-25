import { Router } from 'express';
import { getPrijateObjednavky } from '../controllers/ordersController.js';
import { getVyhledaneObjednavky } from '../controllers/ordersSearchController.js';

const ordersRouter = Router();

ordersRouter.get('/objednavky/prijate', getPrijateObjednavky);
ordersRouter.get('/objednavky/prijate/vyhledane', getVyhledaneObjednavky);

export default ordersRouter;
