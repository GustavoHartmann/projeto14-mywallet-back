import { collectionUsers } from "../database/db.js";
import { signInSchema } from "../models/singInSchema.js";
import bcrypt from "bcrypt";

export async function signInValidation(req, res, next) {
  const { email, password } = req.body;

  const { error } = signInSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((d) => d.message);
    res.status(422).send(errors);
    return;
  }

  try {
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
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }

  res.locals.user = req.body;

  next();
}
