import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';
import { create } from 'domain';

@Controller('users') // => /users
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ResponseMessage("Create a new user")
  async create(
    // @Body("email") email: string,
    // @Body("password") password: string,
    // @Body("name") name: string,
    @Body() hoidanit: CreateUserDto,
    @User() user: IUser,
  ) {
    let newUser = await this.usersService.create(hoidanit, user);
    return {
      _id: newUser._id,
      createdAt: newUser.createdAt
    }
  }

  @Get()
  @ResponseMessage("Fetch user with paginate")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage("Fetch user by id")
  async findOne(@Param('id')
  id: string) {
    //const  id : string = req.params.id
    const foundUser = await this.usersService.findOne(id);
    return foundUser;
  }

  @ResponseMessage("Update a user")
  @Patch()
  update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    console.log("updateUserDto", updateUserDto)
    console.log("user", user )
    let updatedUser = this.usersService.update(updateUserDto, user);
    return updatedUser;
  }

  @Delete(':id')
  @ResponseMessage("Delete a user")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
