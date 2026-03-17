// PDF Export Functionality using html2pdf.js
(function () {
  'use strict';

  // Generate filename from resume content
  function getResumeFilename() {
    const nameElement = document.querySelector('.resume-header h1');
    if (nameElement) {
      const name = nameElement.textContent.trim().replace(/\s+/g, '_');
      return `${name}_Resume.pdf`;
    }
    return 'Resume.pdf';
  }

  // Export to PDF using html2pdf.js
  window.exportToPDF = function () {
    const element = document.getElementById('resume-content');
    const filename = getResumeFilename();

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: filename,
      image: { type: 'jpeg', quality: 0.8 },
      html2canvas: {
        scale: 1.5,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait',
        compress: true,
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    // Show loading state
    const button = document.querySelector('.pdf-button');
    const originalText = button.textContent;
    button.textContent = 'Generating PDF...';
    button.disabled = true;

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        button.textContent = originalText;
        button.disabled = false;
      })
      .catch((error) => {
        console.error('PDF generation failed:', error);
        button.textContent = 'Export Failed - Try Again';
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 3000);
      });
  };

  // Add keyboard shortcut for PDF export (Ctrl/Cmd + P)
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();
      exportToPDF();
    }
  });

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function () {
    console.log('Resume loaded - Ready for PDF export');

    // Add aria-label to button
    const pdfButton = document.querySelector('.pdf-button');
    if (pdfButton) {
      pdfButton.setAttribute('aria-label', 'Export resume to PDF');
    }
  });
})();
