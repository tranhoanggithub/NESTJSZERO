import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Job } from 'src/jobs/schemas/job.schema';
import { Role } from 'src/roles/schemas/role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop()
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    age: number;

    @Prop()
    gender: string;

    @Prop()
    address: string;

    @Prop({ type: Object })
    company: {
        _id: MongooseSchema.Types.ObjectId; name: String;
    };

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Role.name })
    role: mongoose.Schema.Types.ObjectId;

    @Prop()
    refreshToken: string;

    @Prop({ type: { _id: MongooseSchema.Types.ObjectId, email: String } })
    createdBy: { _id: MongooseSchema.Types.ObjectId; email: string };

    @Prop({ type: { _id: MongooseSchema.Types.ObjectId, email: String } })
    updatedBy: { _id: MongooseSchema.Types.ObjectId; email: string };

    @Prop({ type: { _id: MongooseSchema.Types.ObjectId, email: String } })
    deletedBy: { _id: MongooseSchema.Types.ObjectId; email: string };

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;


}

export const UserSchema = SchemaFactory.createForClass(User);