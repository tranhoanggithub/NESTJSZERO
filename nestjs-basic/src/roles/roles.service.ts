import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RoleDocument, Role as RolesM } from './schemas/role.schema';
import { IUser } from 'src/users/users.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import {ADMIN_ROLE} from 'src/databases/sample';

@Injectable()
export class RolesService {
  constructor(@InjectModel(RolesM.name) private roleModel: SoftDeleteModel<RoleDocument>) { }

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = createRoleDto;

    const isExist = await this.roleModel.findOne({ name });
    if (isExist) {
      throw new BadRequestException(`Role với name = "${name}" đã tồn tại`);
    }

    const newRole = await this.roleModel.create({
      name,
      description,
      isActive,
      permissions,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return newRole;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    console.log("vao day");
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.roleModel.find(filter).skip(offset).limit(defaultLimit).sort(sort as any).select('-password').populate(population).exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      result
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found permissions with id=${id}`);
    }
    return await this.roleModel.findById(id).populate({ path: 'permissions', select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 } });
  }

  async update(_id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    const { name } = updateRoleDto;

    // const isExist = await this.roleModel.findOne({ name });
    // if (isExist && isExist._id.toString() !== _id.toString()) {
    //   throw new BadRequestException(`Role với name = "${name}" đã tồn tại`);
    // }

    const updated = await this.roleModel.updateOne(
      { _id },
      {
        ...updateRoleDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return updated;
  }

  async remove(id: string, user: IUser) {
    const foundRole = await this.roleModel.findById(id);
    if (foundRole.name === "ADMIN_ROLE") {
      throw new BadRequestException("Không thể xóa role ADMIN")
    }
    await this.roleModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.roleModel.softDelete({
      id
    })
  }
}

