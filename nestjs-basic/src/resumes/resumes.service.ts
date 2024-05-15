import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class ResumesService {
  // constructor(@InjectModel(Resume.name) private resumeModel: Model<Resume>) { }
  constructor(@InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>) { }
  async create(createUserCvDto: CreateUserCvDto, user: IUser) {
    const { url, companyId, jobId } = createUserCvDto;
    const { email, _id } = user;

    const newCv = await this.resumeModel.create({
      url, companyId, email, jobId, userId: _id, status: "PENDDING", createdBy: { _id, email },
      history: [
        {
          status: "PENDDING",
          createdBy: { _id, email },
          history: [
            {
              status: "PENDDING",
              updatedAt: new Date,
              updatedBy: {
                _id: user._id,
                email: user.email
              }
            }
          ]
        }
      ]

    })
    return {
      _id: newCv?._id,
      createdAt: newCv?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population , projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.resumeModel.find(filter).skip(offset).limit(defaultLimit).sort(sort as any).select(projection as any).populate(population).exec();

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
    if (!mongoose.Types.ObjectId.isValid(id)) { throw new BadGatewayException('not found resume') }

    return await this.resumeModel.findById(id);
  }

  async update(id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadGatewayException('not found resume');

    const updated = await this.resumeModel.updateOne(
      { _id: id },
      {
        status,
        updatedBy: { _id: user._id, email: user.email },
        $push: {
          history: {
            status,
            updatedBy: { _id: user._id, email: user.email },
            updatedAt: new Date(),
          },
        },
      }
    );

    return updated;
  }

  async remove(id: string, user: IUser) {
    await this.resumeModel.updateOne(
      { _id: id },
      { deletedBy: { _id: user._id, email: user.email } }
    )
    return this.resumeModel.softDelete({ _id: id })
  }

  async findByUsers(user: IUser) {
    return await this.resumeModel.find({ userId: user._id });
  }
}
