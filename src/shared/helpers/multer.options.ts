import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';

const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(
      new HttpException(
        'Only .jpg, .jpeg, .png files are allowed!',
        HttpStatus.BAD_REQUEST
      ),
      false
    );
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Date.now();
  callback(null, `${name}${randomName}${fileExtName}`);
};

export const multerOptions = {
  storage: diskStorage({
    destination: process.env.MULTER_DIST,
    filename: editFileName
  }),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: +process.env.MULTER_FILE_SIZE
  }
};
