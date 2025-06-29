import { subDays, format } from 'date-fns';

export function getLastFourDaysStreakIncludingToday(loggedDates: string[]): number {
  let streak = 0;
  let today = new Date();

  for (let i = 0; i <= 3; i++) {
    // get the date of last 4 days including today
    const dateString = format(subDays(today, i), 'yyyy-MM-dd');

    if (loggedDates.includes(dateString)) {
      streak++;
    } else {
      break;  // streak breaks if one day is missing
    }
  }

  return streak;
}
