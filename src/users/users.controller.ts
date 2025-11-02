import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Users')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Unauthorized' })
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: 'Returns user profile', type: User })
  @Get('profile')
  async profile(@Req() req: Request): Promise<User> {
    const user = req.user as User;
    return this.usersService.findById(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: "Returns users you don't have a conversation with.",
    type: [User],
  })
  @Get()
  async findAll(@Req() req: Request, @Query('q') q: string): Promise<User[]> {
    const user = req.user as User;
    return this.usersService.findAll(user.id, q);
  }
}
