import { Request, Response } from 'express';

export function handleSuccessLogin(
  req: any,
  res: any,
  intended: string,
  shouldRemember: boolean,
) {
  if (shouldRemember) {
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
  } else {
    (req.session.cookie as any).expires = false;
  }

  (req.session as any).passport.info = {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    createdAt: Date.now(),
  };

  if (req.accepts('html')) {
    return res.redirect(intended || '/');
  }
  return res.json({
    returnTo: intended || '/',
  });
}
