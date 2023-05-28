import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';

import fs = require('fs')
import FileType = require('file-type')

import path = require('path')

type validFileExtension = 'png' | 'jpg' | 'jpeg'
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg'

const validFileExtension: validFileExtension[] = ['png', 'jpg', 'jpeg']
const validMimeType: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg']

//! creamos los tipos de extensiones que soporta la carga:
export const saveImageToStorage = {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
            const fileExtension: string = path.extname(file.originalname)
            const filename: string = uuidv4() + fileExtension
            callback(null, filename)
        },
    }),
    fileFilter: (req, file, callback) => {
        const allowedMimeTypes: validMimeType[] = validMimeType
        allowedMimeTypes.includes(file.mimetype) ? callback(null, true): callback(null, false)
    }
}

//! Funcion para update de imagenes
export const removeFile = (fullFilePath: string) => {
    try {
        fs.unlinkSync(fullFilePath)
    }
    catch(e) {
        console.log(e)
    }
}