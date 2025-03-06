
import { Reservation } from '@/hooks/reservations';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate and download a PDF file for a reservation
 */
export const downloadReservationPDF = (reservation: Reservation): void => {
  // Initialize jsPDF
  const doc = new jsPDF();
  
  // Add company logo/name to the top
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('Sholom', 105, 20, { align: 'center' });
  
  // Reservation title
  doc.setFontSize(16);
  doc.text('Confirmation de réservation', 105, 30, { align: 'center' });
  
  // Reservation ID and date
  doc.setFontSize(10);
  doc.text(`Réservation #${reservation.id}`, 20, 40);
  doc.text(`Réservée le: ${new Date(reservation.createdAt).toLocaleDateString()}`, 20, 45);
  
  // Property details
  doc.setFontSize(14);
  doc.text('Informations sur le logement', 20, 55);
  
  // Property table
  (doc as any).autoTable({
    startY: 60,
    head: [['Propriété', 'Emplacement']],
    body: [
      [reservation.listingTitle, reservation.listingLocation]
    ],
    theme: 'grid',
    headStyles: { fillColor: [66, 66, 66] },
  });
  
  // Reservation details
  doc.setFontSize(14);
  doc.text('Détails de la réservation', 20, (doc as any).lastAutoTable.finalY + 10);
  
  // Format dates
  const checkIn = new Date(reservation.checkIn).toLocaleDateString();
  const checkOut = new Date(reservation.checkOut).toLocaleDateString();
  
  // Calculate number of nights
  const nights = Math.round(
    (new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / 
    (1000 * 60 * 60 * 24)
  );
  
  // Reservation details table
  (doc as any).autoTable({
    startY: (doc as any).lastAutoTable.finalY + 15,
    head: [['Arrivée', 'Départ', 'Nuits', 'Voyageurs', 'Statut']],
    body: [
      [checkIn, checkOut, nights, reservation.guests, reservation.status]
    ],
    theme: 'grid',
    headStyles: { fillColor: [66, 66, 66] },
  });
  
  // Price details
  doc.setFontSize(14);
  doc.text('Détails du prix', 20, (doc as any).lastAutoTable.finalY + 10);
  
  // Format price
  const priceFCFA = Math.round(reservation.totalPrice * 655.957).toLocaleString('fr-FR');
  
  // Price table
  (doc as any).autoTable({
    startY: (doc as any).lastAutoTable.finalY + 15,
    head: [['Description', 'Montant']],
    body: [
      ['Prix total', `${priceFCFA} FCFA`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [66, 66, 66] },
  });
  
  // Footer with page numbers
  // Get the current page count - fixed approach
  const pageCount = (doc as any).internal.pages.length - 1;
  
  doc.setFontSize(10);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text('Merci d\'avoir choisi Sholom pour votre séjour.', 105, 287, { align: 'center' });
    doc.text(`Page ${i} sur ${pageCount}`, 105, 292, { align: 'center' });
  }
  
  // Save the PDF
  doc.save(`reservation-${reservation.id}.pdf`);
};
