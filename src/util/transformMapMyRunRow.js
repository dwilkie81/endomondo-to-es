import { COLS } from '../constants/mapMyRunColumn';
import { dateFormatter } from './mapMyRunDateFormatter';

const MOUNTAIN_BIKING = 'Mountain Biking';

const sportTransform = {
    'Walk': 'Walking',
    'Bike Ride': 'Cycling (Sport)',
    'Run': 'Running',

    // 'MOUNTAIN_BIKING': 'Mountain Biking',
    // 'SPINNING': 'Turbo Trainer',
    // 'CYCLING_TRANSPORTATION': 'Cycling (Transport)',
    // 'RUNNING': 'Running',
    // 'SNOWBOARDING': 'Snowboarding',
    // 'CLIMBING': 'Climbing',
    // 'CROSSFIT': 'Crossfit',
    // 'ICE_SKATING': 'Ice Skating'  
};

export const transformMapMyRunRow = (row) => {
    let sport = sportTransform[row[COLS.ACTIVITY_TYPE]];
    const created_date = dateFormatter(row[COLS.DATE_SUBMITTED]);
    const start_time = dateFormatter(row[COLS.WORKOUT_DATE]);
    const duration_s = Number(row[COLS.WORKOUT_TIME]);
    const end_time = start_time + duration_s;
    const distance_km = Number(row[COLS.DISTANCE]);
    const calories_kcal = Number(row[COLS.CALORIES]);   
    const speed_avg_kmh = Number(row[COLS.AVG_SPEED]);
    const speed_max_kmh = Number(row[COLS.MAX_SPEED]);
    const tags = row[COLS.NOTES].replace(/^b\'/, '').replace(/\'$/, '').split(' ').filter(tag => tag.startsWith('#')).map(tag => tag.replace(/^#/, '').toUpperCase());

    // Map my run doesn't distinguish between different cycling in the export
    if (sport === 'Cycling (Sport)' && tags.includes('MOUNTAIN_BIKING')) {
        sport = MOUNTAIN_BIKING;
    } 

    // TODO: More generic way to handle tags for parts which aren't tagged in Map My Run
    if (start_time <= (new Date(2021, 2, 21).getTime()) && tags.includes('CORTEX')) {
        tags.push('TRAILBOSS3')
    }

    return {
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
};