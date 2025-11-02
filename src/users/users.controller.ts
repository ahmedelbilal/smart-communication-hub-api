import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiTooManyRequestsResponse()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ description: 'Returns user profile', type: User })
  @Get('profile')
  async profile(@Req() req: Request): Promise<User> {
    const user = req.user as User;
    return this.usersService.findById(user.id);
  }

  @ApiOkResponse({
    description: "Returns users you don't have a conversation with.",
    type: [User],
  })
  @Get()
  async findAll(@Req() req: Request, @Query('q') q: string): Promise<User[]> {
    const user = req.user as User;
    return this.usersService.findAll(user.id, q);
  }
}
