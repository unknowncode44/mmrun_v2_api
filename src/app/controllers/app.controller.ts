import { Controller, Get, Param, Post, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { FileInterceptor } from '@nestjs/platform-express'
import { removeFile, saveImageToStorage } from '../helper/image-storage';
import { Observable, of } from 'rxjs';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  handleUpload(@UploadedFile() file: Express.Multer.File) {
      if(!file) return of({ error: 'File must be a png, jpg or jpeg' })
      //! Obtenemos el nombre para guardar en la base de datos!
      else return `File uploaded: ${file.filename}`

      // Esta funcion es para eliminar la imagen o modificar la que esta (agregar / eliminar)
      const imagesFolderPath = join(process.cwd(), 'uploads')
      const fullImagePath = join(imagesFolderPath + '/' + file)
      removeFile(fullImagePath)
  }

  @Put('upload')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  changeImage(@UploadedFile() file: Express.Multer.File, @Param('name') name: string) {
    // Pasamos el nombre de la imagen
    const imagesFolderPath = join(process.cwd(), 'uploads')
    const fullImagePath = join(imagesFolderPath + '/' + name)
    removeFile(fullImagePath)
    if(!file) return of({ error: 'File must be a png, jpg or jpeg' })
    else return 'File uploaded'
  }

  @Get('upload')
  findImage(@Req() req, @Res() res): Observable<object> {
    console.log(__dirname + 'uploads' +req.body.filename);
    
    return of(res.sendFile(req.body.filename, { root: './uploads' }))
  }
}
