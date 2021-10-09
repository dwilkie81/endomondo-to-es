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
    if (tags.includes('CORTEX')) {
        if (start_time < (new Date(2021, 2, 22).getTime())) {
            tags.push('TRAILBOSS3');
        }

        // 21st March 2021 new rear tyre
        if (start_time > (new Date(2021, 2, 21).getTime())) {
            tags.push('MAXXISMINION');
        }

        // 21st March 2021 new tube for rear tyre, 19th July 2021 puncture in tube, revert to tubless
        if (start_time > (new Date(2021, 2, 21).getTime()) && start_time < (new Date(2021, 6, 19).getTime())) {
            tags.push('TUBE30');
        }

        // 27th July 2021 New pads for cortex - track stock brakes since new before then        
        if (start_time < (new Date(2021, 6, 27).getTime())) {
            tags.push('FRONTBRAKE12');
            tags.push('REARBRAKE12');
        }

        // 27th July 2021 New pads for cortex
        if (start_time >= (new Date(2021, 6, 26).getTime())) {
            tags.push('FRONTBRAKE12A');
            tags.push('REARBRAKE12A');
        }
    }

    if (tags.includes('FRONTIER')) {
        if (start_time > (new Date(2021, 2, 27).getTime())) {
            tags.push('XKING1');
            tags.push('REARMECH6C');
            tags.push('MOUNTAINKING6');
        }

        // 02/08/2021 Moved cassette/chain from ariel onto frontier
        if (start_time > (new Date(2021, 7, 2).getTime())) {
            tags.push('CASETTE16A');
            tags.push('CHAIN16A');
        }

        // 08/10/2021 Moved caliper from ariel/rear rotor onto frontier
        if (start_time > (new Date(2021, 9, 8).getTime())) {
            tags.push('REARBRAKE1S');
            tags.push('ROTOR5A');
        }        
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