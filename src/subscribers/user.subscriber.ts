import { userEmitter } from './emitters';
import { emailSetting, events } from '../config/constants';
import { TYPES } from '../types';
import container from '../inversify.config';
import User from '../entities/user.entity';

import { IEmailService, ITemplateService, ILogger } from '../interfaces/common.interface';

type UserEmitterData = {
  user: User;
};

/*
 * On user create
 * Send email
 */
userEmitter.on(events.onUserCreate, async (args: UserEmitterData) => {
  const operation = events.onUserCreate;

  const logger = container.get<ILogger>(TYPES.Logger);
  logger.init('user.subscriber');

  const emailService: IEmailService = container.get<IEmailService>(TYPES.EmailService);
  const handlebarsService: ITemplateService = container.get<ITemplateService>(TYPES.HandlebarsService);
  let emailBody: string = emailSetting.newUser.body;

  if (!args?.user?.email) {
    return logger.info({
      operation,
      message: `User Email not found for sending onUserCreate email`,
      data: {},
    });
  }

  const userHtml = handlebarsService.compile({
    template: emailBody,
    data: {},
  });

  emailService
    .sendEmail({
      to: args.user.email,
      from: emailSetting.fromEmail,
      subject: emailSetting.newUser.subject,
      html: userHtml,
    })
    .then((response) => {
      logger.info({
        operation,
        message: `Registration email has been sent to ${args.user?.email}`,
        data: response,
      });
    })
    .catch((err) => {
      logger.error({
        operation,
        message: 'Error sending user create email',
        data: err,
      });
    });
});

export default userEmitter;
