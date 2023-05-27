import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../services/users/users.service';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any): Promise<User> {
        const user = await this.userService.findById(payload.sub);

        if(!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
