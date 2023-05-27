import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from '../../entities/user.entity' 

@Injectable()
// extenderemos la clase UsersService con el TypeORMCrudService de nestjsx/crud-typeorm
// de ese modo contaremos con los metodos integrados en la clase. Le pasaremos como parametro la entidad User

export class UsersService extends TypeOrmCrudService<User> {

    // en el constructor inyectaremos el repositorio usando el decorador InjectRepository de TypeORM, de ese modo
    // contamos con que nuestra configuracion de TypeORM del app.module aplica tambien a este CRUD
    constructor(@InjectRepository(User) repo) {
        
        // usamos la llamada super para invocar el constructor de la clase base, en este caso TypeOrmCrudService
        super(repo)
    }

    async findByUsername(username: string): Promise<User> {
        return await this.repo.findOne({ where: { username: username} });
    }

    async findById(id: number): Promise<User> {
        return await this.repo.findOne({ where: { id: id} });
    }
}
