/**
 * Usage node -r esm loadMapMyRunData.js [path to csv]
 */

import { transformMapMyRunRow } from './util/transformMapMyRunRow';
import { createIndex, aliasIndex, loadRecord, removeOldAliases } from './util/manageIndexes';

const csv = require('csv-parser');
const fs = require('fs');
 
const mapMyRunPath = process.argv[2];
const now = (new Date()).getTime();
const indexPrefix = 'workouts.mapmyrun.';
const indexName = `${indexPrefix}${now}`;
const aliasName = 'workouts';
 
const main = async () => {
    console.log('Transforming from: ', mapMyRunPath);

    await createIndex(indexName);
    console.log('index created: ', indexName);

    await aliasIndex(indexName, aliasName);
    console.log('alias indexed as ', aliasName);

    fs.createReadStream(mapMyRunPath)
    .pipe(csv())
    .on('data', (row) => {
        const document = transformMapMyRunRow(row);
        loadRecord(document, indexName);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
        removeOldAliases(aliasName, indexPrefix);
    });
};

main();