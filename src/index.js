import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import signUpRoute from "./routes/signUp.routes.js";
import signInRoute from "./routes/signIn.routes.js";
import statementsRoute from "./routes/statements.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

app.use(signUpRoute);
app.use(signInRoute);
app.use(statementsRoute);

app.listen(process.env.PORT, () =>
  console.log(`Server running in port: ${process.env.PORT}`)
);
