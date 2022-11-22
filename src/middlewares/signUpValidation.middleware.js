import { collectionUsers } from "../database/db.js";
import { signUpSchema } from "../models/singUpSchema.js";

export async function signUpValidation(req, res, next) {
  const { email } = req.body;

  const { error } = signUpSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((d) => d.message);
    res.status(422).send(errors);
    return;
  }

  try {
    const emailInUse = await collectionUsers.findOne({
      email,
    });

    if (emailInUse) {
      res.status(409).send({
        message: "This email is already in use",
      });
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
