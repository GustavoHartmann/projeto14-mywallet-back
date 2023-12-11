import { v4 as uuid } from "uuid";
import { collectionUsers, collectionSessions } from "../database/db.js";

export async function signIn(req, res) {
  const { email } = res.locals.user;

  try {
    const user = await collectionUsers.findOne({ email });

    const token = uuid();

    await collectionSessions.insertOne({
      token,
      userId: user._id,
    });

    res.send({ token });
  } catch (err) {
    res.sendStatus(500);
  }
}
