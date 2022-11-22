import { collectionSessions } from "../database/db.js";
import { statementsSchema } from "../models/statementsSchema.js";

export async function postStatementValidation(req, res, next) {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    res.sendStatus(401);
    return;
  }

  const { error } = statementsSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((d) => d.message);
    res.status(422).send(errors);
    return;
  }

  try {
    const session = await collectionSessions.findOne({
      token,
    });

    if (!session) {
      res.sendStatus(401);
      return;
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }

  res.locals.user = req.body;
  req.token = token;

  next();
}

export async function getStatementValidation(req, res, next) {
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
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }

  req.token = token;

  next();
}
