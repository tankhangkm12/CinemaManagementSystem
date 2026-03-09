import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { IsPublic } from 'src/common/decorators/auth.metadata';

@Controller('api/v1/auth')
@IsPublic()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() registerUserDTO : RegisterUserDto) {
    return this.authService.signUp(registerUserDTO)
  }

  @Post('sign-in')
  async signIn(@Body() loginUserDto : LoginUserDto){
    return this.authService.signIn(loginUserDto)
  }


}
