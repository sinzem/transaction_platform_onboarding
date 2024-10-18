import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from "fs";
import * as path from 'path';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {

    async createFile(file): Promise<string> {
        try {
            const resolution = file.originalname.split(".");
            const fileName = uuid.v4() + `.${resolution.at(-1)}`; 
            const filePath = path.resolve(__dirname, "..", 'static'); 
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true}); 
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer);
            return fileName;
        } catch (e) {
            throw new HttpException("An error occurred while writing the file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
