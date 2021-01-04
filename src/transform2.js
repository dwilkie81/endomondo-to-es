/**
 * Usage node transform2.js [path to csv]
 * will output to ../data/csv.to.object
 */

const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
 
const mapMyRunPath = process.argv[2];
const outputPath = path.join(__dirname, '../data/csv.to.object');

console.log('Transforming from: ', mapMyRunPath);

const COLS = {
    ACTIVITY_TYPE: 'Activity Type',
    DATE_SUBMITTED: 'Date Submitted',
    WORKOUT_DATE: 'Workout Date',
    WORKOUT_TIME: 'Workout Time (seconds)',
    DISTANCE: 'Distance (km)',
    CALORIES: 'Calories Burned (kCal)',
    AVG_SPEED: 'Avg Speed (km/h)',
    MAX_SPEED: 'Max Speed (km/h)',
    NOTES: 'Notes',
};

const sportTransform = {
    'Walk': 'Walking',
    'Bike Ride': 'Cycling (Sport)',

    // 'MOUNTAIN_BIKING': 'Mountain Biking',
    // 'SPINNING': 'Turbo Trainer',
    // 'CYCLING_TRANSPORTATION': 'Cycling (Transport)',
    // 'RUNNING': 'Running',
    // 'SNOWBOARDING': 'Snowboarding',
    // 'CLIMBING': 'Climbing',
    // 'CROSSFIT': 'Crossfit',
    // 'ICE_SKATING': 'Ice Skating'  
};

const monthTransform = {
    'Jan.': 0,
    'Nov.': 10,
    'Dec.': 11,
};

const dateFormatter = (date) => {
    const parts = date.split(' ');
    const month = monthTransform[parts[0]];
    const day = parts[1].replace(/,$/, '');
    const year = parts[2];

    return new Date(year, month, day).getTime();
};

let rowNum = 0;

fs.createReadStream(mapMyRunPath)
  .pipe(csv())
  .on('data', (row) => {
      rowNum++;

      const sport = sportTransform[row[COLS.ACTIVITY_TYPE]];
      const created_date = dateFormatter(row[COLS.DATE_SUBMITTED]);
      const start_time = dateFormatter(row[COLS.WORKOUT_DATE]);
      const duration_s = Number(row[COLS.WORKOUT_TIME]);
      const end_time = start_time + duration_s;
      const distance_km = Number(row[COLS.DISTANCE]);
      const calories_kcal = Number(row[COLS.CALORIES]);   
      const speed_avg_kmh = Number(row[COLS.AVG_SPEED]);
      const speed_max_kmh = Number(row[COLS.MAX_SPEED]);
      const tags = row[COLS.NOTES].replace(/^b\'/, '').replace(/\'$/, '').split(' ').filter(tag => tag.startsWith('#')).map(tag => tag.replace(/^#/, ''));

      const document = {
          sport,
          created_date,
          start_time,
          end_time,
          duration_s,
          distance_km,
          calories_kcal,
          altitude_min_m: 0,
          altitude_max_m: 0,
          speed_avg_kmh,
          speed_max_kmh,
          hydration_l: 0,
          ascend_m: 0,
          descend_m: 0,
          tags,
      };

      const outPath = path.join(outputPath, rowNum + '.json');

      fs.writeFileSync(outPath, JSON.stringify(document));
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });