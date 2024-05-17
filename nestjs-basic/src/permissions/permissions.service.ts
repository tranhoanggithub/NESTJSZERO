import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PermissionDocument, Permission as PermissionM } from './schemas/permission.schema';
import { IUser } from 'src/users/users.interface';
import { UpdateJobDto } from 'src/jobs/dto/update-job.dto';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(PermissionM.name) private permissionModel: SoftDeleteModel<PermissionDocument>) { }
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const {
      name,
      apiPath,
      method,
      module
    } = createPermissionDto;

    const isExist = await this.permissionModel.findOne({ apiPath, method });
    if (isExist) {
      throw new BadRequestException(`Permission với apiPath = ${apiPath}, method= ${method} đã tồn tại`);
    }

    const newPermission = await this.permissionModel.create({
      name,
      apiPath,
      method,
      module,
      createdBy: {
        __id: user._id,
        email: user.email
      }
    });
    return newPermission;


  }

  async findAll(currentPage: number, limit: number, qs: string) {
    // return `This action returns all permissions`;
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.permissionModel.find(filter).skip(offset).limit(defaultLimit).sort(sort as any).select('-password').populate(population).exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      result
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found permissions with id=${id}`)
    }
    return await this.permissionModel.findById(id)
  }

  async update(_id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    // return `This action updates a #${id} permission`;
    const updated = await this.permissionModel.updateOne(
      { _id },
      {
        ...updatePermissionDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return updated;
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      return `not found user`;
    await this.permissionModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return this.permissionModel.softDelete({
      _id
    })
  }
}
