import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../../controllers/users/users.controller';
import { UsersService } from '../../services/users/users.service';
import { User } from '../../entities/user.entity';
import { Crud } from '@nestjsx/crud';

// usamos el decorador crud en el modulo indicando que tipo de entidad usaremos
@Crud({
    model: {type: User}
})

// luego en el modulo indicamos que usaremos TypeORMModule, su metodo forFeature (solo para indicar la entidad User)
// inyectamos el controlador en los controllers y el servicio en los providers
@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}
