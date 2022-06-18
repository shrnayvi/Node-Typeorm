import Joi from 'joi';

import strings from '../config/strings';

export default class RoleValidation {
  static create() {
    return Joi.object({
      name: Joi.string().required().error(new Error(strings.nameRequired)),
      description: Joi.string().error(new Error(strings.descriptionRequired)),
    });
  }
  static update() {
    return Joi.object({
      id: Joi.string().required().error(new Error(strings.idRequired)),
      name: Joi.string().required().error(new Error(strings.nameRequired)),
      description: Joi.string().error(new Error(strings.descriptionRequired)),
    });
  }
}
