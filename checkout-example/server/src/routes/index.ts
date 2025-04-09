import { Router } from "express"
import cart from './cart'
import customer from "./customer"
import product from "./product"
import session from './session'

const router = Router();

router.use(session);
router.use(customer);
router.use(product)
router.use(cart)

export default router;
