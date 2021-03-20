// For some reason months in my CVS use the short version before March 2021
// and the long version afterwards!  So handle either format.

const monthTransform = {
    'Jan.': 0, 'January': 0,
    'Feb.': 1, 'February': 1,
    'Mar.': 2, 'March': 2,
    'Apr.': 3, 'April': 3,
    'May.': 4, 'May': 4,
    'Jun.': 5, 'June': 5,
    'Jul.': 6, 'July': 6,
    'Aug.': 7, 'August': 7,
    'Sep.': 8, 'September': 8,
    'Oct.': 9, 'October': 9,
    'Nov.': 10, 'November': 10,
    'Dec.': 11, 'December': 11,
};

export const dateFormatter = (date) => {
    const parts = date.split(' ');
    const month = monthTransform[parts[0]];
    const day = parts[1].replace(/,$/, '');
    const year = parts[2];

    return new Date(year, month, day).getTime();
};