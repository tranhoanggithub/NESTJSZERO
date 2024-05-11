import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, Validate, ValidateNested } from 'class-validator';
import { Document, Schema as MongooseSchema } from 'mongoose';

class Company {
    @IsNotEmpty()
    _id: MongooseSchema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}
export class CreateUserDto {

    @IsNotEmpty({
        message: 'Name khong duoc de trong',
    })
    name: string;

    @IsEmail({}, {
        message: 'Email khong dung dinh dang',
    })
    @IsNotEmpty({
        message: 'Email khong duoc de trong',
    })
    email: string;

    @IsNotEmpty({
        message: 'Password khong duoc de trong',
    })
    password: string;

    @IsNotEmpty({
        message: 'Age khong duoc de trong',
    })
    age: number;

    @IsNotEmpty({
        message: 'Gender khong duoc de trong',
    })
    gender: string;

    @IsNotEmpty({
        message: 'Address khong duoc de trong',
    })
    address: string;

    @IsNotEmpty({
        message: 'Role khong duoc de trong',
    })
    role: string;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;
}

export class RegisterUserDto {

    @IsNotEmpty({
        message: 'Name khong duoc de trong',
    })
    name: string;

    @IsEmail({}, {
        message: 'Email khong dung dinh dang',
    })
    @IsNotEmpty({
        message: 'Email khong duoc de trong',
    })
    email: string;

    @IsNotEmpty({
        message: 'Password khong duoc de trong',
    })
    password: string;

    @IsNotEmpty({
        message: 'Age khong duoc de trong',
    })
    age: number;

    @IsNotEmpty({
        message: 'Gender khong duoc de trong',
    })
    gender: string;

    @IsNotEmpty({
        message: 'Address khong duoc de trong',
    })
    address: string;
}
