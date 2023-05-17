import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud'
import { User } from '../../entities/user.entity'
import { UsersService } from '../../services/users/users.service';

// del mismo modo que en el modulo indicamos usando el decorador Crud que usaremos la entidad User
@Crud({
    model: {type: User}
})

// pasamos en el constructor que estaremos inyectando los metodos de nuestro servicio UsersService
@Controller('users')
export class UsersController {
    constructor(public service: UsersService){}
}
