import joi from "joi";

export const signUpSchema = joi.object({
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
