import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, Validate, ValidateNested } from 'class-validator';
import { Document, Schema as MongooseSchema } from 'mongoose';


class Company {
    @IsNotEmpty()
    _id: MongooseSchema.Types.ObjectId;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    logo: string;
}

export class CreateJobDto {

    @IsNotEmpty({
        message: 'Name khong duoc de trong',
    })
    name: string;
    @IsNotEmpty({
        message: 'Skill không được để trống',
    })
    @IsArray({ message: 'skills có định dạng là array' })
    @IsString({ each: true, message: "skill định dạng là string" })
    skills: string[];

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    @IsNotEmpty({
        message: 'location khong duoc de trong',
    })
    location: string;

    @IsNotEmpty({
        message: 'Salary khong duoc de trong',
    })
    salary: number;

    @IsNotEmpty({
        message: 'Quantity khong duoc de trong',
    })
    quantity: string;

    @IsNotEmpty({
        message: 'level khong duoc de trong',
    })
    level: string;

    @IsNotEmpty({
        message: 'Description khong duoc de trong',
    })
    description: string;

    @IsNotEmpty({
        message: 'startDate không được để trống',
    })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'startDate có định dạng là Date' })
    startDate: Date;

    @IsNotEmpty({ message: 'endDate không được để trống' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'endDate có định dạng là Date' })
    endDate: Date;

    @IsNotEmpty({ message: 'isActive không được để trống' })
    @IsBoolean({ message: 'isActive có định dạng là boolean' })
    isActive: boolean;
}
