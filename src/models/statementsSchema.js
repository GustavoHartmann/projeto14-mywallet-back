import joi from "joi";

export const statementsSchema = joi.object({
  value: joi.number().required(),
  description: joi.string().required(),
});
