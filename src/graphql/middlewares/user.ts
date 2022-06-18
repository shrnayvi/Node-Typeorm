import { NextFn, MiddlewareFn } from 'type-graphql';

import { TYPES } from '../../types';
import { Role as RoleEnum } from '../../config/constants';
import strings from '../../config/strings';
import container from '../../inversify.config';
import * as apiError from '../../utils/api-error';
import { checkRoles } from '../../utils/common';

import { IErrorService } from '../../interfaces/common.interface';
import { IGraphqlContext } from '../../interfaces/graphql.interface';

const name = 'user.middleware';

/**
 * Check if the user is the owner of the resource
 * Has access for admin.
 */
export const isSelf: MiddlewareFn<IGraphqlContext> = async ({ context, args }, next: NextFn) => {
  const operation = 'isSelf';
  const errorService = container.get<IErrorService>(TYPES.ErrorService);

  try {
    const isAdmin = checkRoles({
      expectedRoles: [RoleEnum.Admin],
      userRoles: context?.user?.roles ?? [],
    });

    if (isAdmin) {
      return await next();
    }

    const id = args?.input?.id ?? args?.id;
    if (id !== context?.user?.id) {
      throw new apiError.ForbiddenError({
        details: [strings.notAllowedToPerformAction],
      });
    }

    await next();
  } catch (err) {
    errorService.throwError({
      err,
      name,
      operation,
      logError: true,
    });
  }
};
