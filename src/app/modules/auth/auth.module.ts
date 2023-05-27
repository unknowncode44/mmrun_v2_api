import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../../services/auth/auth.service';
import { JwtStrategy } from '../../utilities/jwt.strategy';
import { User } from '../../entities/user.entity';
import { LoginController } from '../../controllers/auth/login/login.controller';
import { UsersService } from '../../services/users/users.service';

@Module({
  imports: [
    PassportModule.register({ 
        defaultStrategy: 'jwt', 
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }, // Adjust the token expiration as needed
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [LoginController],
  providers: [AuthService, JwtStrategy, UsersService],
})
export class AuthModule {}