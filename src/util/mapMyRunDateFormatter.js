const monthTransform = {
    'Jan.': 0,
    'Feb.': 1,
    'Mar.': 2,
    'Apr.': 3,
    'May.': 4,
    'Jun.': 5,
    'Jul.': 6,
    'Aug.': 7,
    'Sep.': 8,
    'Oct.': 9,
    'Nov.': 10,
    'Dec.': 11,
};

export const dateFormatter = (date) => {
    const parts = date.split(' ');
    const month = monthTransform[parts[0]];
    const day = parts[1].replace(/,$/, '');
    const year = parts[2];

    return new Date(year, month, day).getTime();
};