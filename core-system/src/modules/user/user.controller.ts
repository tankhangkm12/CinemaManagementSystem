import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ParseEmailPipe, ParseUuidPipe } from 'src/common/pipe/parse-object.pipe';
import { IsPublic, RequirePermissions } from 'src/common/decorators/auth.metadata';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('new')
  async createUser(@Body() createUserDto : CreateUserDto) : Promise<any> {
    return this.userService.createUser(createUserDto)
  }

  @Get('/:id')
  @IsPublic()
  @RequirePermissions('user:read')
  async getUserById(@Param('id',ParseUuidPipe) id : string) : Promise<any> {
    return this.userService.getUserById(id)
  }

  @Get('/email/:email')
  @RequirePermissions('user:read')
  async getUserByEmail(@Param('email',ParseEmailPipe) email : string) : Promise<any> {
    return this.userService.getUserByEmail(email)
  }
}
