/**
 * Usage node -r esm loadMapMyRunData.js [path to csv]
 */

import { transformMapMyRunRow } from './util/transformMapMyRunRow';
import { createIndex, aliasIndex } from './util/manageIndexes';
import axios from 'axios';

const csv = require('csv-parser');
const fs = require('fs');
 
const mapMyRunPath = process.argv[2];
const now = (new Date()).getTime();
const indexName = `workouts.mapmyrun.${now}`;
const elasticSearchHost = 'http://localhost:9200';
 
const main = async () => {
    console.log('Transforming from: ', mapMyRunPath);

    await createIndex(indexName);
    console.log('index created: ', indexName);

    await aliasIndex(indexName, 'workouts');
    console.log('alias indexed as workouts');

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

    fs.createReadStream(mapMyRunPath)
    .pipe(csv())
    .on('data', (row) => {
        const document = transformMapMyRunRow(row);
        loadRecord(document);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });
};

main();