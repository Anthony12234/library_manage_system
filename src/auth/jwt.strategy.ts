import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtPayload {
  userid: number;
  username: string;
  role: string;
}

export interface RequestWithUser extends Express.Request {
  user: {
    username: string;
    userid: number;
    role: string;
  };
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const user = await this.userService.findOneById(payload.userid);
    if (!user) {
      throw new UnauthorizedException('您的账号已被删除或冻结，登录已失效！');
    }
    return {
      userid: payload.userid,
      username: payload.username,
      role: payload.role,
    };
  }
}
