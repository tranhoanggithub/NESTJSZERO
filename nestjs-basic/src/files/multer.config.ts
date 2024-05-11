import { Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import * as fs from 'fs'; // Corrected import statement for 'fs'
import { diskStorage } from "multer";
import * as path from "path"; // Corrected import statement for 'path'

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    getRootPath = (): string => {
        return process.cwd();
    };

    ensureExists(targetDirectory: string): void {
        fs.mkdir(targetDirectory, { recursive: true }, (error) => {
            if (!error) {
                console.log('Directory successfully created, or it already exists.');
                return;
            }
            if (error.code === 'EEXIST') {
                console.log('Requested location already exists, but it\'s not a directory.');
            } else if (error.code === 'ENOTDIR') {
                console.log('The parent hierarchy contains a file with the same name as the dir you\'re trying to create.');
            } else {
                console.error(error);
            }
        });
    }

    createMulterOptions(): MulterModuleOptions {
        return {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const folder = req?.headers?.folder_type ?? "default";
                    const uploadPath = path.join(this.getRootPath(), `public/images/${folder}`);
                    this.ensureExists(uploadPath);
                    cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                    let extName = path.extname(file.originalname);
                    let baseName = path.basename(file.originalname, extName);
                    let finalName = `${baseName}-${Date.now()}${extName}`;
                    cb(null, finalName);
                }
            })
        };
    }
}
