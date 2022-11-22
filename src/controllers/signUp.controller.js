import bcrypt from "bcrypt";
import { collectionUsers } from "../database/db.js";

export async function singUp(req, res) {
  const { name, email, password } = res.locals.user;
  const passwordHash = bcrypt.hashSync(password, 10);
  const user = {
    name,
    email,
    password: passwordHash,
  };

  try {
    await collectionUsers.insertOne(user);

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
