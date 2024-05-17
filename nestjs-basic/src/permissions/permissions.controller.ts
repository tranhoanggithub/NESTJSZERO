import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { use } from 'passport';
import { IUser } from 'src/users/users.interface';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  @ResponseMessage('Create a new permission')
  async create(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUser) {
    // return this.permissionsService.create(createPermissionDto);
    return this.permissionsService.create(createPermissionDto, user);

  }

  @Get()
  @ResponseMessage('Fetch all permissions with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.permissionsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch a permission by id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a permission")
  update(
    @Param('id') id: string,
    @Body() UpdatePermissionDto: UpdatePermissionDto,
    @User() user: IUser) {
    let updatePermissionDto = this.permissionsService.update(id, UpdatePermissionDto, user);
    return updatePermissionDto;
  }

  @Delete(':id')
  @ResponseMessage("Delete a permission")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.remove(id, user);
  }
}
