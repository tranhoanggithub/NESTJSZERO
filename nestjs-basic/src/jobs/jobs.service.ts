import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { User } from 'src/decorator/customize';
import { Jobs } from './jobs.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { JobDocument, Job as JobM } from './schemas/job.schema'
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class JobsService {
  constructor(@InjectModel(JobM.name) private jobModel: SoftDeleteModel<JobDocument>) { }
  async create(createJobDto: CreateJobDto, jobs: Jobs) {
    const {
      name,
      skills,
      company,
      salary,
      quantity,
      level,
      description,
      startDate,
      endDate,
      isActive,
      location
    }
      = createJobDto;
    let newJobs = await this.jobModel.create({
      name,
      skills,
      company,
      salary,
      quantity,
      level,
      description,
      isActive,
      location,
      // createdBy: {
      //   _id: jobs._id,
      //   email: jobs.email
      // }
    });
    return newJobs;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.jobModel.find(filter).skip(offset).limit(defaultLimit).sort(sort as any).select('-password').populate(population).exec();

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

  async findOne(id: number) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`
    return await this.jobModel.findOne({
      _id: id
    }).select("-password") //exclude ><include
  }

  async update(_id: string, updateJobDto: UpdateJobDto, user: IUser) {
    const updated = await this.jobModel.updateOne(
      { _id },
      {
        ...updateJobDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return updated;

  }

  async remove(_id: string, user: IUser) {
    // return `This action removes a #${id} job`;
    if (!mongoose.Types.ObjectId.isValid(_id))
      return `not found user`;

    await this.jobModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id:user._id,
          email:user.email
        }
      }
    )

    return this.jobModel.softDelete({
      _id
    })
  }
}
