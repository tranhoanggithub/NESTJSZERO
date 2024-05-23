import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema'
import { User } from 'src/decorator/customize';
import mongoose, { Model, mongo } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

import passport from 'passport';
import { create } from 'domain';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
import { USER_ROLE } from 'src/databases/sample';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';



@Injectable()
export class UsersService {
  constructor(@InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>) { }
  // return createUserDto;
  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }
  async create(createUserDto: CreateUserDto, @User() user: IUser) {
    const {
      name, email, password, age, gender, address, role, company
    }
      = createUserDto;

    // add login check email
    const isExist = await this.userModel.findOne({ email })

    if (isExist) {
      throw new BadRequestException(`Email ${email} da ton tai. vui long chon email khac`)
    }
    const hashPassword = this.getHashPassword(password);

    let newUser = await this.userModel.create({
      name, email, password: hashPassword, age, gender, address, role, company,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return newUser;
  }
  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.userModel.find(filter).skip(offset).limit(defaultLimit).sort(sort as any).select('-password').populate(population).exec();

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
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`
    return await this.userModel.findOne({
      _id: id
    }).select("-password")
      .populate({ path: "role", select: { name: 1, _id: 1 } }) //exclude ><include
  }
  // return `This action returns a #${id} user`;

  findOneByUserName(username: string) {
    return this.userModel.findOne({
      email: username
    }).populate({ path: "role", select: { name: 1 } });
    // return `This action returns a #${id} user`;
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    console.log("UPDATE USER DTO", updateUserDto)
    console.log("USER", user)
    const updated = await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return updated;
  }

  async remove(id: string, user: IUser) {
    // return `This action removes a #${id} user`;
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`;

    const foundUser = await this.userModel.findById(id);
    if (foundUser.email === "admin@gmail.com") {
      throw new BadRequestException(`Khong thể xóa tài khoản admin@gmail.com`)
    }

    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )

    return this.userModel.softDelete({
      _id: id
    })
  }

  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;
    // add login check email
    const isExist = await this.userModel.findOne({ email })

    if (isExist) {
      throw new BadRequestException(`Email ${email} da ton tai. vui long chon email khac`)
    }
    const userRole = await this.roleModel.findOne({ name: USER_ROLE });
    const hashPassword = this.getHashPassword(password);
    let newRegister = await this.userModel.create({
      name, email,
      password: hashPassword,
      age,
      gender,
      address,
      role: userRole?._id
    })
    return newRegister;
  }
  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id },
      { refreshToken }
    )
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({
      refreshToken
    })
  }
}
