/**
 * Usage node -r esm loadData.js [source] [indexName]
 * 
 * source is one of endomondo
 * 
 * will create a new index and mapping, alias to workouts and load the endomondo data
 */
import { createIndex, aliasIndex } from './util/manageIndexes';
import axios from 'axios';
import { exit } from 'process';

const elasticSearchHost = 'http://localhost:9200';

const path = require('path');
const fs = require('fs');

const dataPaths = {
    endomondo: path.join(__dirname, '../data/array.to.object'),
};

const dataSource = process.argv[2];
const indexName = process.argv[3];

const dataPath = dataPaths[dataSource];

const loadRecord = async (data) => {
    try {
        await axios({
            method: 'POST',
            url: `${elasticSearchHost}/${indexName}/_doc`,
            data,
        });
    } catch (error) {
        console.log(error.response);
    }
};

const loadFile = async (fileName) => {
    const filePath = path.join(dataPath, fileName);
    console.log('processing file: ', filePath);
    
    if(!fileName.endsWith('.json')) {
        return;
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    await loadRecord(data);
};

const main = async () => {
    try {
        await createIndex(indexName);
        console.log('index created: ', indexName);

        await aliasIndex(indexName, 'workouts');
        console.log('alias indexed as workouts');

        fs.readdir(dataPath, async (err, files) => {
            if (err) {
                return console.log('Error listing directory', err);
            } 
            
            console.log('Found ', files.length, ' files');

            for(let i=0; i<files.length; i++){
                await loadFile(files[i]);
            }  
        });

    } catch (error) {
        console.log('something went wrong', error);
    }
}

if (!dataPath) {
    console.log('invalid dataSource', dataSource);
    exit;
}

main();