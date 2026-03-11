import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findOneByUsername(createUserDto.username);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async findOneByUsername(username: string) {
    if (!username) {
      throw new Error('Username is required');
    }
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      return null; // 用户不存在，返回 null
    }
    return user;
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOneByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(username: string) {
    const user = await this.findOneByUsername(username);
    if (!user) {
      return 'User not found';
    }
    return await this.userRepository.remove(user);
  }
}
