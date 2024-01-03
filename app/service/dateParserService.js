export function parseDate(dateString) {
    const endDateString = dateString.split(' - ')[1] || dateString; // Extract end date or use the same as start date

    const dateParts = endDateString.split(' ');
    const [datePart, timePart] = dateParts;

    const [day, month, year] = datePart.split('.');

    let hours = 0;
    let minutes = 0;

    if (timePart) {
        const [hoursStr, minutesStr] = timePart.split(':');
        hours = parseInt(hoursStr, 10);
        minutes = parseInt(minutesStr, 10);
    }

    return new Date(year, month - 1, day, hours, minutes);
}
