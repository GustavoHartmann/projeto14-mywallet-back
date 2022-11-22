import { Router } from "express";
import {
  getStatements,
  postStatement,
} from "../controllers/statements.controllers.js";
import {
  getStatementValidation,
  postStatementValidation,
} from "../middlewares/statementsValidation.middleware.js";

const router = Router();

router.post("/statements", postStatementValidation, postStatement);

router.get("/statements", getStatementValidation, getStatements);

export default router;
