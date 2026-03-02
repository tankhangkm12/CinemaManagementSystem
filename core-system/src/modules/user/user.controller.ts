import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ParseEmailPipe, ParseObjectIdPipe } from 'src/common/pipe/parse-object.pipe';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('new')
  async createUser(@Body() createUserDto : CreateUserDto) : Promise<any> {
    return this.userService.createUser(createUserDto)
  }

  @Get('/:id')
  async getUserById(@Param('id',ParseObjectIdPipe) id : string) : Promise<any> {
    return this.userService.getUserById(id)
  }

  @Get('/email/:email')
  async getUserByEmail(@Param('email',ParseEmailPipe) email : string) : Promise<any> {
    return this.userService.getUserByEmail(email)
  }
}
