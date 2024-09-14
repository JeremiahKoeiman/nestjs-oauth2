import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Post,
  Query,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from '../dtos';
import { Request, Response } from 'express';
import { GuestGuard } from '../guards';
import { RegisterService } from '@app/modules/user';

@UseGuards(GuestGuard)
@Controller('auth')
export class RegisterController {
  constructor(
    @Inject(forwardRef(() => RegisterService))
    private readonly registerService: RegisterService,
  ) {}

  @Post('register')
  async handleRegister(
    @Body() data: RegisterDto,
    @Query('redirect_uri') intended: string,
    @Req() req: any,
    @Res() res: any,
  ) {
    const user = await this.registerService.register(data);

    await new Promise<void>((resolve, reject) =>
      req.login(user, err => {
        if (err) {
          return reject(err);
        }
        resolve();
      }),
    );

    if (req.accepts('json')) {
      return res.status(201).json({
        returnTo: intended || '/',
      });
    }

    res.redirect(intended || '/');
  }

  @Get('register')
  @Render('index')
  showRegisterForm(@Req() req: any) {
    return {
      csrfToken: req.csrfToken(),
    };
  }
}
