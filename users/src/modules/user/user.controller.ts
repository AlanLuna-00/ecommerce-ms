import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @MessagePattern('user.register')
  async register(@Payload() dto: CreateUserDto) {
    return await this._userService.register(dto);
  }

  @MessagePattern('user.login')
  async login(@Payload() dto: LoginDto) {
    return await this._userService.login(dto);
  }

  @MessagePattern('user.update')
  async update(@Payload() payload: { id: string; data: UpdateUserDto }) {
    const { id, data } = payload;
    return await this._userService.update(id, data);
  }
}
