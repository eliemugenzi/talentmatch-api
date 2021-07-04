import { Joi, celebrate } from 'celebrate';

export const createOneRule = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
});
