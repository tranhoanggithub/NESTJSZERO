import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedArraySubdocument, HydratedDocument } from 'mongoose'
import { timestamp } from 'rxjs';
import { Job } from 'src/jobs/schemas/job.schema'

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({ timestamps: true })
export class Permission {
    @Prop()
    name: string;

    @Prop()
    apiPath: string;

    @Prop()
    method: string;

    @Prop()
    module: string

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

export const PermissionSchema = SchemaFactory.createForClass(Permission);
