import {Router} from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { dropNotification, getNotification } from "../controllers/notification.controller.js";

const router = Router();

router.route("/").get(authenticate,getNotification)
router.route("/delete").delete(authenticate,dropNotification)
export default router;