/**
 * Generate a unique ID
 * Format: prefix_timestamp_random
 */
export function generateId(prefix: string = 'field'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Generate a simple numeric ID
 */
export function generateNumericId(): string {
  return Math.floor(Math.random() * 10000).toString();
}

/**
 * Generate form ID
 */
export function generateFormId(): string {
  return `form_${generateNumericId()}`;
}
