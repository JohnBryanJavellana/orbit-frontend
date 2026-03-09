import { format, parseISO } from 'date-fns';
import dayjs, { Dayjs } from 'dayjs';

export default function useDateFormat() {
    const FormatDatetimeToHumanReadable = (datetime: string, showTime: boolean) => {
        if (!datetime) return "";

        try {
            return format(
                parseISO(datetime),
                `MMMM d, yyyy${showTime ? ' hh:mm a' : ''}`
            );
        } catch {
            return datetime;
        }
    }

    const CountDays = (from: Dayjs, to: Dayjs, suffix?: string, calendarDays?: boolean) => {
        const fromDate = dayjs(from);
        let toDate = dayjs(to);
        toDate = calendarDays ? toDate.add(1, 'day') : toDate;
        const count = toDate.diff(fromDate, 'day');

        return `(${count > 0 ? count : 1} day${count > 1 ? 's' : ''}${suffix})`;
    }

    return { FormatDatetimeToHumanReadable, CountDays };
}