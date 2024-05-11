import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true })
export class Job {
    @Prop()
    name: string;

    @Prop()
    skills: string[];

    @Prop({ type: Object })
    company: {
        _id: MongooseSchema.Types.ObjectId; name: String;
    };

    @Prop()
    salary: number;

    @Prop()
    quantity: number;

    @Prop()
    level: string;

    @Prop()
    description: string;

    @Prop()
    startDate: Date;

    @Prop()
    endData: string;

    @Prop()
    isActive: boolean;

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

export const JobSchema = SchemaFactory.createForClass(Job);