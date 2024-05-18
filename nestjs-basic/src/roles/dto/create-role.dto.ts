import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose, { mongo } from "mongoose";

export class CreateRoleDto {
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'descriptipon không được để trống' })
    description: string;

    @IsNotEmpty({ message: 'isActive không được để trống' })
    @IsBoolean({ message: 'isActive có giá trị boolean' })
    isActive: boolean;

    @IsNotEmpty({ message: 'permissions không được để trống' })
    @IsMongoId({ each: true, message: "each permission phải là kiểu ObjectId" })
    @IsArray({ message: "permissions phải là mảng" })
    permissions: mongoose.Schema.Types.ObjectId[];
}
