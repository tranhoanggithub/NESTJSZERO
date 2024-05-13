import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose, { Schema, Types } from "mongoose";

export class CreateResumeDto {
    @IsNotEmpty({ message: 'email khong duoc de trong' })
    email: string;

    @IsNotEmpty({ message: 'userId khong duoc de trong' })
    userId: Types.ObjectId;

    @IsNotEmpty({ message: 'url khong duoc de trong' })
    url: string;

    @IsNotEmpty({ message: 'status khong duoc de trong' })
    status: string;

    @IsNotEmpty({ message: 'companyId khong duoc de trong' })
    companyId: Types.ObjectId;

    @IsNotEmpty({ message: 'jobId khong duoc de trong' })
    jobId: Types.ObjectId;
}

export class CreateUsesCvDto {
    @IsNotEmpty({ message: 'url khong duoc de trong' })
    url: string;

    @IsNotEmpty({ message: 'companyId khong duoc de trong' })
    @IsMongoId({ message: 'companyId is a mongo id' })
    companyId:mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'jobId khong duoc de trong' })
    @IsMongoId({ message: 'jobId is a mongo id' })
    jobId: mongoose.Schema.Types.ObjectId;
}
