import { Controller, Get, Post, Render, Req, UseGuards, Request, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import cookieParser from 'cookie-parser';
import { Response as ExpressResponse } from 'express'; // Renamed Response to ExpressResponse

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ResponseMessage("User Login")
  handleLogin(
    @Request() req,
    @Res({ passthrough: true }) response: ExpressResponse) { // Renamed Response to ExpressResponse
    return this.authService.login(req.user, response);
  }

  // @UseGuards(JwtAuthGuard)
  @Public()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('profile1')
  getProfile1(@Request() req) {
    return req.user;
  }


  @Public()
  @ResponseMessage("Register a new user")
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @ResponseMessage("Get user information")
  @Get('/account')
  handlegetAccount(@User() user: IUser) { //req.user
    return { user };
  }

  @Public()
  @ResponseMessage("Get User by refresh token")
  @Get('/refresh')
  handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: ExpressResponse) { //req.user

    const refreshToken = (request as any).cookies["refresh_token"];
    return this.authService.processNewToken(refreshToken, response);
  }

  @ResponseMessage("Logout user")
  @Post('/logout')
  handleLogout(
    @Res({ passthrough: true }) response: ExpressResponse,
    @User() user: IUser
  ) {
    return this.authService.logout(response, user);
  }
}
