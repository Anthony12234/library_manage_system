import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser } from '../auth/jwt.strategy';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list-users')
  findAll(@CurrentUser('username') currentUsername: string) {
    console.log('当前请求的用户信息:', currentUsername);
    return this.userService.findAll();
  }

  @Get(':username')
  findOneByUsername(@Param('username') username: string) {
    return this.userService.findOneByUsername(username);
  }

  @Patch(':username')
  update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(username, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':username')
  remove(
    @Param('username') username: string,
    @CurrentUser('username') currentUsername: string,
    @CurrentUser('role') role: string,
  ) {
    if (role === 'admin' || currentUsername === username) {
      return this.userService.remove(username);
    } else {
      return 'Permission denied';
    }
  }
}
