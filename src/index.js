import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient } from "mongodb";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const signUpSchema = joi.object({
  name: joi.string().min(3).required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  passwordConfirmation: joi
    .string()
    .equal(joi.ref("password"))
    .required()
    .label("Confirm password")
    .options({
      messages: { "any.only": "{{#label}} does not match with password" },
    }),
});

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
  await mongoClient.connect();
  console.log("Mongodb connected");
} catch (err) {
  console.log(err);
}

const db = mongoClient.db("projeto14-mywallet-back");
const collectionUsers = db.collection("users");

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, 10);
  const user = {
    name,
    email,
    password: passwordHash,
  };

  try {
    const { error } = signUpSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((d) => d.message);
      res.status(422).send(errors);
      return;
    }
    const emailInUse = await collectionUsers.findOne({
      email,
    });

    if (emailInUse) {
      res.status(409).send({
        message: "This email is already in use",
      });
      return;
    }

    await collectionUsers.insertOne(user);

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server running in port: ${process.env.PORT}`)
);
