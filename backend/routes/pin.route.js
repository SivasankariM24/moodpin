import express from 'express';
import {getPin, getPins, createPin, interactionCheck, interact} from '../controllers/pin.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.get("/", getPins);
router.get("/:id", getPin);
router.post("/", verifyToken, createPin);//authentication required to create a pin
router.get("/interaction-check/:id", interactionCheck);
router.post("/interact/:id", verifyToken, interact);//authentication required to like / save a pin

export default router;