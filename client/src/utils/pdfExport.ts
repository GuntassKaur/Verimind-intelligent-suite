import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generatePDF = async () => {
    const reportElement = document.getElementById('report');
    if (!reportElement) {
        console.error("Report element not found");
        return;
    }

    // Save original styles
    const originalClass = reportElement.className;
    const originalHeight = reportElement.style.height;
    const originalOverflow = reportElement.style.overflow;

    // Temporarily apply print styles for html2canvas to capture it cleanly
    reportElement.style.display = "block";
    reportElement.style.position = "static";
    reportElement.style.left = "auto";
    reportElement.style.visibility = "visible";
    reportElement.style.height = "auto";
    reportElement.style.overflow = "visible";
    reportElement.style.opacity = "1";

    // Add a small delay for state update and rendering
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        const canvas = await html2canvas(reportElement, {
            scale: 2,
            useCORS: true,
            windowWidth: 1024,
            logging: true,
            backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgProps = pdf.getImageProperties(imgData);
        // Calculate the height of the image based on its aspect ratio
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let heightLeft = imgHeight;
        let position = 0;

        // First page
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Multi-page support if content is long
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save('VeriMind_Report.pdf');
    } catch (error) {
        console.error("PDF generation error: ", error);
    } finally {
        // Restore original styles
        reportElement.className = originalClass;
        reportElement.style.height = originalHeight;
        reportElement.style.overflow = originalOverflow;
        reportElement.style.display = "";
        reportElement.style.position = "fixed";
        reportElement.style.left = "-10000px";
        reportElement.style.opacity = "0";
    }
};
