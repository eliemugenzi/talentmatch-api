import { Joi, celebrate } from 'celebrate';
import { phoneRegex } from 'constants/shared';

export const createOneRule = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
});

export const applyJobRule = celebrate({
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().regex(phoneRegex).required(),
    resume_url: Joi.string().required(),
    description: Joi.string().required(),
  }),
});
