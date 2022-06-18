import Joi from 'joi';

import strings from '../config/strings';

export default class AuthValidation {
  static login() {
    return Joi.object({
      email: Joi.string().required().error(new Error(strings.emailRequired)),
      password: Joi.string().required().error(new Error(strings.passwordRequired)),
    });
  }

  static register() {
    return Joi.object({
      email: Joi.string().required().error(new Error(strings.emailRequired)),
      password: Joi.string().required().error(new Error(strings.passwordRequired)),
      name: Joi.string().required().error(new Error(strings.nameRequired)),
      phone: Joi.string().required().error(new Error(strings.phoneRequired)),
    });
  }
}
