import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../../controllers/auth/dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ){}

    async login(loginDto: LoginDto){
        console.log(loginDto);
        
        const user  = await this.userService.findByUsername(loginDto.username);

        if(!user || user.password !== loginDto.password) {
            throw new UnauthorizedException('Credenciales Invalidas');
        }

        const payload  = { username: user.username, sub: user.id};
        const token  = this.jwtService.sign(payload);

        return { access_token: token };

    }
}
