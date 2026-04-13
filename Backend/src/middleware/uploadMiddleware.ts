import multer from 'multer';
import path from 'path';
import fs from 'fs'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './src/productImages';

        //if not folder it will create 
        if(!fs.existsSync(dir))  fs.mkdirSync(dir)
        cb(null, dir); 
    },
    filename: (req, file, cb) => {
        // Creates a name like: user-123456789.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})
export const upload = multer({ storage: storage })