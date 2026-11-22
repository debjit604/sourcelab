export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalWeeks: number;
  dayOfWeekBorn: string;
  nextBirthdayDays: number;
  nextBirthdayDayOfWeek: string;
  zodiacSign: string;
}

export function getZodiacSign(month: number, day: number): string {
  const cutoffs = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
  const signsAfter = [
    "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn",
  ];
  const signsBefore = [
    "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini",
    "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius",
  ];
  return day >= cutoffs[month - 1] ? signsAfter[month - 1] : signsBefore[month - 1];
}

export function calculateAge(dobStr: string, asOfDate: Date = new Date()): AgeResult | null {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) return null;

  const target = new Date(asOfDate.getFullYear(), asOfDate.getMonth(), asOfDate.getDate());
  const birth = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());

  if (birth > target) return null;

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    // Days in previous month
    const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffMs = target.getTime() - birth.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayOfWeekBorn = daysOfWeek[dob.getDay()];

  // Next Birthday Calculation
  let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBday < target) {
    nextBday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  const nextDiffMs = nextBday.getTime() - target.getTime();
  const nextBirthdayDays = Math.ceil(nextDiffMs / (1000 * 60 * 60 * 24));
  const nextBirthdayDayOfWeek = daysOfWeek[nextBday.getDay()];

  const zodiacSign = getZodiacSign(birth.getMonth() + 1, birth.getDate());

  return {
    years,
    months,
    days,
    totalDays,
    totalHours,
    totalMinutes,
    totalWeeks,
    dayOfWeekBorn,
    nextBirthdayDays,
    nextBirthdayDayOfWeek,
    zodiacSign,
  };
}
