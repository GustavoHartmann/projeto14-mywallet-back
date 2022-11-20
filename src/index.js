import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient } from "mongodb";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

const signUpSchema = joi.object({
  name: joi.string().min(3).required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  passwordConfirmation: joi
    .string()
    .equal(joi.ref("password"))
    .required()
    .label("Password confirmation")
    .options({
      messages: { "any.only": "{{#label}} does not match with password" },
    }),
});

const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const statementsSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required(),
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
const collectionSessions = db.collection("sessions");
const collectionStatements = db.collection("statements");

app.post("/sign-up", async (req, res) => {
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

app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { error } = signInSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((d) => d.message);
      res.status(422).send(errors);
      return;
    }

    const user = await collectionUsers.findOne({ email });

    if (!user) {
      res.status(401).send({ message: "Email address is incorrect" });
      return;
    }

    const correctPassword = bcrypt.compareSync(password, user.password);

    if (!correctPassword) {
      res.status(401).send({ message: "Password incorrect" });
      return;
    }

    const token = uuid();

    await collectionSessions.insertOne({
      token,
      userId: user._id,
    });

    res.send({ token });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/statements", async (req, res) => {
  const { value, description } = req.body;
  const { authorization } = req.headers;
  const day = dayjs().format("DD/MM");

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const { error } = statementsSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((d) => d.message);
      res.status(422).send(errors);
      return;
    }

    const session = await collectionSessions.findOne({
      token,
    });

    if (!session) {
      res.sendStatus(401);
      return;
    }

    const statement = {
      value: Number(value),
      description,
      day,
      userId: session.userId,
    };

    await collectionStatements.insertOne(statement);

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/statements", async (req, res) => {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const session = await collectionSessions.findOne({ token });

    if (!session) {
      res.sendStatus(401);
      return;
    }

    const user = await collectionUsers.findOne({ _id: session.userId });
    const statements = await collectionStatements
      .find({ userId: session.userId })
      .toArray();

      delete user.password;

    res.send({ user, statements });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server running in port: ${process.env.PORT}`)
);
