/**
 * Handles college ID input by filtering to numeric characters only and limiting to 8 characters.
 * @param value - The raw input value
 * @returns The filtered and truncated numeric string (max 8 characters)
 */
export function handleCollegeIdInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 8);
}

/**
 * Handles keyboard events for college ID input fields.
 * Allows only digits and navigation/editing keys (Backspace, Delete, ArrowLeft, ArrowRight, Tab, Enter).
 * @param event - The keyboard event to handle
 */
export function handleCollegeIdKeyDown(event: KeyboardEvent): void {
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
  if (allowedKeys.includes(event.key)) {
    return;
  }
  if (!/^\d$/.test(event.key)) {
    event.preventDefault();
  }
}
