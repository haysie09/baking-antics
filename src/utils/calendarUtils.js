// Filename: src/utils/calendarUtils.js

/**
 * Generates a Google Calendar link for a given bake event.
 * @param {object} bake - The bake object (from upcoming bakes or journal).
 * @returns {string} The generated Google Calendar URL.
 */
export const generateGoogleCalendarLink = (bake) => {
    // Helper to format a date as YYYYMMDD, required for all-day events
    const formatDate = (date) => {
        return date.toISOString().slice(0, 10).replace(/-/g, '');
    };

    const bakeDate = new Date(
        bake.bakeDate?.toDate ? bake.bakeDate.toDate() : (bake.bakingDate?.toDate ? bake.bakingDate.toDate() : bake.bakeDate)
    );

    // For an all-day event, the end date is the day after the start date
    const nextDay = new Date(bakeDate);
    nextDay.setDate(bakeDate.getDate() + 1);

    const startDate = formatDate(bakeDate);
    const endDate = formatDate(nextDay);

    // Use the appropriate title field
    const title = `Bake: ${bake.bakeName || bake.entryTitle}`;

    // Build a detailed description for the calendar event
    let description = '';
    if (bake.personalNotes) {
        description += `Notes:\n${bake.personalNotes}\n\n`;
    }
    const sourceLink = bake.link || bake.sourceURL;
    if (sourceLink) {
        description += `Recipe Link: ${sourceLink}`;
    }

    // Construct the URL with encoded components
    const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    const params = new URLSearchParams({
        text: title,
        dates: `${startDate}/${endDate}`, // Format for an all-day event
        details: description.trim(),
        // You could add a location if you had that data
        // location: 'My Kitchen' 
    });

    return `${baseUrl}&${params.toString()}`;
};