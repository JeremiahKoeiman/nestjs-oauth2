import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { handleSuccessLogin } from '@app/modules/auth/utils';

@Controller('auth/social')
export class SocialController {
  @UseGuards(AuthGuard('facebook'))
  @Get('/facebook')
  async facebookCallback(
    @Req() req: any,
    @Res() res: any,
    @Query('state') intended: string,
  ) {
    await new Promise<void>((resolve, reject) => {
      req.logIn(req.user, err => (err ? reject(err) : resolve()));
    });

    const returnTo =
      intended && intended !== 'undefined' ? decodeURIComponent(intended) : '/';

    return handleSuccessLogin(req, res, returnTo, false);
  }

  @UseGuards(AuthGuard('google'))
  @Get('/google')
  async googleCallback(
    @Req() req: any,
    @Res() res: any,
    @Query('state') intended: string,
  ) {
    await new Promise<void>((resolve, reject) => {
      req.logIn(req.user as any, err => (err ? reject(err) : resolve()));
    });

    const returnTo =
      intended && intended !== 'undefined' ? decodeURIComponent(intended) : '/';

    return handleSuccessLogin(req, res, returnTo, false);
  }
}
