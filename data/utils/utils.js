const DEFAULT_TIMEZONE = "America/Vancouver";

export const getCurrentDate = (timeZone = DEFAULT_TIMEZONE) => {
    return new Date().toLocaleDateString('en-CA', { timeZone }); // 'YYYY-MM-DD'
};