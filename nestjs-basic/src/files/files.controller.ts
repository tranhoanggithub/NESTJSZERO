import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public, ResponseMessage } from 'src/decorator/customize';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Public()
  @Post('upload')
  @ResponseMessage("Upload Singe file")
  @UseInterceptors(FileInterceptor('fileUpload'))
  uploadFile(@UploadedFile(new ParseFilePipeBuilder()
    // .addFileTypeValidator({
    //   fileType: /\.(jpg|jpeg|png|image\/png|gif|txt|pdf|docx|text\/plain)$/i,
    // })
    .addMaxSizeValidator({
      maxSize: 1024 * 1024
    })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }),) file: Express.Multer.File) {
    return {
      filename: file.filename,
    }
  }
  // @Public()
  // @Post('upload')
  // @UseInterceptors(FileInterceptor('hoidanit'))
  // uploadFile(@UploadedFile(new ParseFilePipeBuilder()
  //   .addFileTypeValidator({
  //     fileType: /\.(jpg|jpeg|png|gif|txt|pdf|docx)$/i,
  //   })
  //   .addMaxSizeValidator({
  //     maxSize: 1024 * 1024 // 1MB
  //   })
  //   .build({
  //     errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
  //   })) file: Express.Multer.File) {
  //     console.log(file);
  //     return {
  //       message: 'File uploaded successfully!',
  //       filename: file.filename,
  //       size: file.size,
  //       mimetype: file.mimetype,
  //     };
  // }

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.create(createFileDto);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
