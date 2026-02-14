/**
 * 格式化日期为中文格式
 */
export function formatDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    ...options,
  };
  return new Intl.DateTimeFormat('zh-CN', defaultOptions).format(date);
}

/**
 * 格式化日期（含日）
 */
export function formatDateFull(date: Date): string {
  return formatDate(date, { day: 'numeric' });
}

/**
 * 格式化日期（仅年月）
 */
export function formatDateYearMonth(date: Date): string {
  return formatDate(date);
}
