import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedArraySubdocument, HydratedDocument } from 'mongoose'
import { Permission } from 'src/permissions/schemas/permission.schema';
import { timestamp } from 'rxjs';
import { Job } from 'src/jobs/schemas/job.schema'
import e from 'express';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    isActive: string;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Permission.name })
    permissions: Permission[];

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string;
    }

    @Prop({ type: Object })
    updateBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string;
    }

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    deleteAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);