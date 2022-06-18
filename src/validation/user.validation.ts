import Joi from 'joi';

import strings from '../config/strings';

export default class UserValidation {
  static create() {
    return Joi.object({
      email: Joi.string().email().required().error(new Error(strings.emailRequired)),
      name: Joi.string().required().error(new Error(strings.nameRequired)),
      phone: Joi.string().required().error(new Error(strings.phoneRequired)),
      password: Joi.string().required().error(new Error(strings.passwordRequired)),
      roles: Joi.array().items(Joi.string().required()).required().error(new Error(strings.rolesRequired)),
    });
  }

  static update() {
    return Joi.object({
      id: Joi.string().required().error(new Error(strings.idRequired)),
      name: Joi.string().allow(null, ''),
      phone: Joi.string().allow(null, ''),
    });
  }
}
