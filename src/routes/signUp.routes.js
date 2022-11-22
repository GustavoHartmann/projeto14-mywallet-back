import { Router } from "express";
import { singUp } from "../controllers/signUp.controller.js";
import { signUpValidation } from "../middlewares/signUpValidation.middleware.js";

const router = Router();

router.post("/sign-up", signUpValidation, singUp);

export default router;
