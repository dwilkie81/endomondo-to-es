/**
 * Usage - node transform.js
 * Assumes endomondo files are in ../data/endomondo.raw and will output
 * to ../data/array.to.object
 */


const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, '../data/endomondo.raw');
const outputPath = path.join(__dirname, '../data/array.to.object');

const keysToRemove = ['points', 'comments', 'pictures', 'routes', 'source'];

const sportTransform = {
  'MOUNTAIN_BIKING': 'Mountain Biking',
  'SPINNING': 'Turbo Trainer',
  'CYCLING_TRANSPORTATION': 'Cycling (Transport)',
  'WALKING': 'Walking',
  'CYCLING_SPORT': 'Cycling (Sport)',
  'RUNNING': 'Running',
  'SNOWBOARDING': 'Snowboarding',
  'CLIMBING': 'Climbing',
  'CROSSFIT': 'Crossfit',
  'ICE_SKATING': 'Ice Skating'    
};

const dateFields = ['created_date', 'start_time', 'end_time'];

const tagsToFix = {
  '45460b': '45650b',
  'heaset4': 'headset4',
  'tubr9d': 'tube9d',
  'joystcik1': 'joystick1',
};

const transformFile = (fileName) => {
    const filePath = path.join(dataPath, fileName);
    const outPath = path.join(outputPath, fileName);
    console.log('processing file: ', filePath);
    
    if(!fileName.endsWith('.json')) {
        return;
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    
    const output = data.reduce((acc, curr) => {
        const key = Object.keys(curr)[0]; 

        if(key === 'tags') {
            acc[key] = curr[key].map(tag => { 
                const parsed = tag[0].name.toLowerCase();
                return tagsToFix[parsed] ? tagsToFix[parsed] : parsed;
            });
        } else if(key === 'sport') {
            acc[key] = sportTransform[curr[key]];
        } else if(dateFields.includes(key)) {
            acc[key] = new Date(curr[key]).getTime();
        } else if(!keysToRemove.includes(key)) {
            acc[key] = curr[key];
        }

        return acc;
    }, {});
    
    fs.writeFileSync(outPath, JSON.stringify(output));
};

const main = () => {
    console.log('looking for files in: ', dataPath);

    fs.readdir(dataPath, (err, files) => {
        if (err) {
            return console.log('Error listing directory', err);
        } 
        
        console.log('Found ', files.length, ' files');

        files.forEach(transformFile);        
    });
};

main();


