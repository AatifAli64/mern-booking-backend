import Joi from "joi";

export const createBookingSchema = Joi.object({
  packageName: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  guests: Joi.number().integer().min(1).required(),
  price: Joi.number().required()
});
