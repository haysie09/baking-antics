// Filename: src/utils/calendarUtils.js

/**
 * Generates a Google Calendar link for a given bake event.
 * @param {object} bake - The bake object (from upcoming bakes or journal).
 * @returns {string|null} The generated Google Calendar URL, or null if the date is invalid.
 */
export const generateGoogleCalendarLink = (bake) => {
    // Helper to format a date as YYYYMMDD, required for all-day events
    const formatDate = (date) => {
        return date.toISOString().slice(0, 10).replace(/-/g, '');
    };

    // --- Defensive Date Handling ---
    const rawDate = bake.bakeDate || bake.bakingDate;
    if (!rawDate) {
        console.error("Error: The bake object is missing a date property.", bake);
        alert("Sorry, cannot add to calendar because this entry is missing a date.");
        return null;
    }

    const bakeDate = new Date(rawDate.toDate ? rawDate.toDate() : rawDate);

    // Check if the resulting date is valid
    if (isNaN(bakeDate.getTime())) {
        console.error("Error: Invalid date created from the bake object.", bake);
        alert("Sorry, cannot add to calendar due to an invalid date in the entry.");
        return null;
    }
    // --- End of Defensive Code ---

    // For an all-day event, the end date is the day after the start date
    const nextDay = new Date(bakeDate);
    nextDay.setDate(bakeDate.getDate() + 1);

    const startDate = formatDate(bakeDate);
    const endDate = formatDate(nextDay);

    const title = `Bake: ${bake.bakeName || bake.entryTitle}`;

    let description = '';
    if (bake.personalNotes) {
        description += `Notes:\n${bake.personalNotes}\n\n`;
    }
    const sourceLink = bake.link || bake.sourceURL;
    if (sourceLink) {
        description += `Recipe Link: ${sourceLink}`;
    }

    const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    const params = new URLSearchParams({
        text: title,
        dates: `${startDate}/${endDate}`,
        details: description.trim(),
    });

    return `${baseUrl}&${params.toString()}`;
};