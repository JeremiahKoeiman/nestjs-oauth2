import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * The user is not authorized to perform this action
 * Usually thrown by a guard returning "false"
 */
@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(
    exception: ForbiddenException,
    host: ArgumentsHost,
    urlOverride?: string,
  ): any {
    const res = host.switchToHttp().getResponse<Response>() as any;
    const req = host.switchToHttp().getRequest<Request>() as any;
    /**
     * If there is a user in the session, log him out
     */
    if (req.user) {
      req.logout(() => console.log('FORBIDDEN EXCEPTION LOGOUT'));
    }
    /**
     * Redirect to the login page
     */
    res.redirect(
      '/auth/login?redirect_uri=' +
        encodeURIComponent(urlOverride || (req.url as any)),
    );
  }
}
