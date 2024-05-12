import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Company {
    @Prop()
    name: string;

    @Prop()
    address: string;

    @Prop()
    description: string;

    @Prop()
    logo: string;

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

export type CompanyDocument = Company & Document;
export const CompanySchema = SchemaFactory.createForClass(Company);
