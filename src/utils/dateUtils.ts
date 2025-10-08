export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isDateValid = (date: string): boolean => {
  const selectedDate = new Date(date);
  const today = new Date();
  const twoDaysFromNow = addDays(today, 2);
  
  return selectedDate >= twoDaysFromNow;
};

export const getDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isTokenActive = (token: { startDate: string; endDate: string }): boolean => {
  const today = new Date();
  const start = new Date(token.startDate);
  const end = new Date(token.endDate);
  
  return today >= start && today <= end;
};

export const getDiningDayNumber = (selectedDate: string, diningMonthStart: string): number => {
  const selected = new Date(selectedDate);
  const start = new Date(diningMonthStart);
  const diffTime = selected.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1); // Day 1 is the start date
};

export const isDiningMonthActive = (diningMonth: { startDate: string; endDate: string }): boolean => {
  const today = new Date();
  const start = new Date(diningMonth.startDate);
  const end = new Date(diningMonth.endDate);
  
  return today >= start && today <= end;
};