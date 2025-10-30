import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  createPartial(name: string, email: string, hashedPassword: string) {
    const user = this.usersRepository.create({ name, email, password: hashedPassword });
    return this.usersRepository.save(user);
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.usersRepository.findOne({
      where: { id },
      select: { id: true, name: true, email: true },
    });
  }

  findAll(id: string, searchTerm?: string) {
    let findOpts: FindOptionsWhere<User>[] = [{ id: Not(id) }];
    if (searchTerm) {
      findOpts = [
        { id: Not(id), name: Like(searchTerm) },
        { id: Not(id), email: Like(searchTerm) },
      ];
    }
    return this.usersRepository.find({
      select: { id: true, name: true },
      where: findOpts,
    });
  }
}
