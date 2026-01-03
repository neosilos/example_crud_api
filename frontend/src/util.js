/**
 * Parses ISO timestamp string to pt/BR style (dd/mm/yyyy)
 *
 * @param {string} timestamp - Time in ISO format
 */
export function parseTimestamp(timestamp) {
    const date = new Date(timestamp);
    const formatted = date.toLocaleDateString("pt-BR");
    return formatted;
}
