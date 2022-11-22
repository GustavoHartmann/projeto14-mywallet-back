import dayjs from "dayjs";
import {
  collectionSessions,
  collectionStatements,
  collectionUsers,
} from "../database/db.js";

export async function postStatement(req, res) {
  const { value, description } = res.locals.user;
  const token = req.token;
  const day = dayjs().format("DD/MM");

  try {
    const session = await collectionSessions.findOne({
      token,
    });

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
}

export async function getStatements(req, res) {
  const token = req.token;

  try {
    const session = await collectionSessions.findOne({ token });
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
}
