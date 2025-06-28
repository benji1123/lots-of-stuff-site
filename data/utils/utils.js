const DEFAULT_TIMEZONE = "America/Vancouver";
const DEFAULT_LOCALE = "en-US";

export const getCurrentDate = (timeZone = DEFAULT_TIMEZONE) => {
    const now = new Date();
    return new Date(now.toLocaleString(DEFAULT_LOCALE, { timeZone })).toISOString().slice(0, 10);
}