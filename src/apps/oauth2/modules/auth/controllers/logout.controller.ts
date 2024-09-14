import { Body, Controller, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('auth')
export class LogoutController {
  @Post('logout')
  handleLogout(
    @Req() req: any,
    @Res() res: any,
    @Body('redirect_uri') redirectTo: string,
    @Query('redirect_uri') redirectToQ: string,
  ) {
    req.logOut(() => console.log('LOGOUT CONTROLLER LOGOUT'));
    res.redirect(redirectTo || redirectToQ || '/');
  }
}
