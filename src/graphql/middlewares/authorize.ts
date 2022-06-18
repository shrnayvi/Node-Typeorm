import { NextFn, MiddlewareFn } from 'type-graphql';

import strings from '../../config/strings';
import * as apiError from '../../utils/api-error';

const authorize = (...roles: string[]): MiddlewareFn => {
  return async ({ context }: any, next: NextFn) => {
    const userRolesObj = context?.user?.roles?.reduce((acc: any, current: any) => {
      acc[current.name] = current;
      return acc;
    }, {});

    let hasAccess = false;
    for (let role of roles) {
      if (userRolesObj[role]) {
        hasAccess = true;
        break;
      }
    }
    if (!hasAccess) {
      throw new apiError.ForbiddenError({
        details: [strings.notAllowedToPerformAction],
      });
    }

    await next();
  };
};

export default authorize;
