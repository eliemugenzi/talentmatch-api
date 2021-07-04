import { Joi, celebrate } from 'celebrate';
import { phoneRegex } from 'constants/shared';

export const signUpRule = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    phone_number: Joi.string().regex(phoneRegex).required(),
    password: Joi.string().min(6).max(15).required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
  }),
});

export const loginRule = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});
