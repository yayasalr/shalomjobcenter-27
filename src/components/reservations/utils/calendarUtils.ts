
/**
 * Calendar utility functions for creating iCal files from reservation data
 */
import { Reservation } from '@/hooks/reservations';

/**
 * Format a date to the iCal date format (YYYYMMDD)
 */
export const formatICalDate = (date: string): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
};

/**
 * Create an iCal file content from reservation data
 */
export const createICalEvent = (reservation: Reservation): string => {
  const checkInDate = formatICalDate(reservation.checkIn);
  const checkOutDate = formatICalDate(reservation.checkOut);
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Sholom//Reservation Calendar//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Séjour à ${reservation.listingTitle}
DTSTART;VALUE=DATE:${checkInDate}
DTEND;VALUE=DATE:${checkOutDate}
DESCRIPTION:Réservation #${reservation.id} pour ${reservation.guests} voyageur(s)\\nAdresse: ${reservation.listingLocation}
LOCATION:${reservation.listingLocation}
STATUS:CONFIRMED
SEQUENCE:0
DTSTAMP:${now}
UID:${reservation.id}@sholom.com
END:VEVENT
END:VCALENDAR`;
};

/**
 * Download an iCal file
 */
export const downloadICalFile = (reservation: Reservation): void => {
  const icalContent = createICalEvent(reservation);
  const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `reservation-${reservation.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Add to Google Calendar
 */
export const addToGoogleCalendar = (reservation: Reservation): void => {
  const checkIn = new Date(reservation.checkIn);
  const checkOut = new Date(reservation.checkOut);
  
  // Format dates for Google Calendar
  const startDate = checkIn.toISOString().replace(/-|:|\.\d+/g, '');
  const endDate = checkOut.toISOString().replace(/-|:|\.\d+/g, '');
  
  const title = encodeURIComponent(`Séjour à ${reservation.listingTitle}`);
  const details = encodeURIComponent(`Réservation #${reservation.id} pour ${reservation.guests} voyageur(s)`);
  const location = encodeURIComponent(reservation.listingLocation);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
  
  window.open(googleCalendarUrl, '_blank');
};
