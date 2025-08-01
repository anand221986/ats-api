export function safeNumeric(value: any): number {
  return value !== null && value !== undefined && value !== '' && !isNaN(value)
    ? Number(value)
    : 0;
}