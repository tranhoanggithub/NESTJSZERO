import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @ResponseMessage('Create a new permission')
  async create(@Body() createPermissionDto: CreateRoleDto, @User() user: IUser) {
    // return this.permissionsService.create(createPermissionDto);
    return this.rolesService.create(createPermissionDto, user);

  }

  @Get()
  @ResponseMessage('Fetch all permissions with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.rolesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch a permission by id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a permission")
  update(
    @Param('id') id: string,
    @Body() UpdateRoleDto: UpdateRoleDto,
    @User() user: IUser) {
    let updatePermissionDto = this.rolesService.update(id, UpdateRoleDto, user);
    return updatePermissionDto;
  }

  @Delete(':id')
  @ResponseMessage("Delete a permission")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}
