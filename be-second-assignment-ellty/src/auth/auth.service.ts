import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

interface AuthDto {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(authDto: AuthDto) {
    const { username, password } = authDto;

    const existingUser = await this.userModel.findOne({ username }).exec();
    if (existingUser) throw new BadRequestException('Username already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      username,
      password: hashedPassword,
    });

    await user.save();

    return { message: 'User registered successfully' };
  }

  async login(authDto: AuthDto) {
    const { username, password } = authDto;

    const user = await this.userModel.findOne({ username }).exec();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload),
      username: user.username,
    };
  }
}
