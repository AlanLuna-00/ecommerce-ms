import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {QUEUE_NAMES} from "../../config/constants";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,

    private readonly _jwtService: JwtService,

    @Inject(QUEUE_NAMES.RABBITMQ_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  async register(dto: CreateUserDto) {
    const exists = await this._userRepository.findOne({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException('Email already in use');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user: User = this._userRepository.create({
        email: dto.email,
        password: hashed,
        name: dto.name,
        role: dto.role
    });
    const saved: User = await this._userRepository.save(user);

    await firstValueFrom(
      this.client.emit('user.created', {
        id: saved.id,
        email: saved.email,
        name: saved.name,
        role: saved.role,
      }),
    );

    return { id: saved.id, email: saved.email, name: saved.name };
  }

  async login(dto: LoginDto) {
    const user = await this._userRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this._jwtService.signAsync(payload);

    return { accessToken: token };
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this._userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, dto);
    const updated = await this._userRepository.save(user);

    return { id: updated.id, email: updated.email, name: updated.name };
  }
}
