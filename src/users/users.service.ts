import {Injectable} from '@nestjs/common';
import {User} from "./users.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dtos/create-user.dto";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User) {}

    create(user: CreateUserDto): Promise<User> {
        return this.userRepository.create<User>(user)
    }

    findOneById(id: number): Promise<User> {
        return this.userRepository.findOne<User>({ where: { id } });
    }

    findOneByEmail(email: string): Promise<User> {
        return this.userRepository.findOne<User>({ where: { email } });
    }

    update(id: number, attrs: Partial<User>) {
        return this.userRepository.update<User>(attrs, {where: {id}})
    }

    clearDB() {
        return this.userRepository.truncate()
    }
}
