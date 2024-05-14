import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { Jobs } from './jobs.interface';
import mongoose from 'mongoose';
import { IUser } from 'src/users/users.interface';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post()
  @ResponseMessage("Create a new job")

  async create(
    @Body() createjobdto: CreateJobDto,
    @User() jobs: Jobs,
  ) {
    let newJobs = await this.jobsService.create(createjobdto, jobs);
    return {
      _id: newJobs._id,
      createdAt: newJobs.createdAt
    }
  }

  @Get()
  @Public()
  @ResponseMessage("Fetch Resumes with paginate")
  findAll(
    @Query("current") currentPage: string, // const currentPage = req.query.page
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.jobsService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage("Fetch jobs by id")
  async findOne(@Param('id')
  id: number) {
    //const  id : string = req.params.id
    const foundUser = await this.jobsService.findOne(id);
    return foundUser;
  }

  @ResponseMessage("Update a job")
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatejobdto: UpdateJobDto,
    @User() user: IUser) {
    let updatedJob = this.jobsService.update(id, updatejobdto, user);
    return updatedJob;
  }

  @Delete(':id')
  @ResponseMessage("Delete a job")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }
}
