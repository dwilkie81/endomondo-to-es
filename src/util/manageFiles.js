import path from 'path';
import { mapMyRunOutputDir } from '../constants/dataFileSystem';

const fs = require('fs');

const deleteFile = (fileName) => {
    if (fileName.endsWith('.json')) {
        fs.unlink(path.join(mapMyRunOutputDir, fileName), (err) => {
            if (err) throw err;
        });
    }
};

export const clearMapMyRunOutputDir = () => {
    fs.readdir(mapMyRunOutputDir, (err, files) => {
        if (err) {
            return console.log('Error listing directory', err);
        } 
        
        console.log('Found ', files.length, ' files');

        files.forEach(deleteFile);   
        
        console.log('Map My Run output directory cleared');
    });
}