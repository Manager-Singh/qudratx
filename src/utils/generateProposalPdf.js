import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateProposalPdf = async (elementId = "proposal-pdf-content") => {
  const input = document.getElementById(elementId);
  if (!input) return alert("PDF container not found!");

  const canvas = await html2canvas(input, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save('proposal-summary.pdf');
};