const { mdToPdf } = require('md-to-pdf');
const path = require('path');

async function convert() {
  try {
    const markdownPath = path.join(__dirname, 'components', 'home', 'SYSTEM_DOCUMENTATION.md');
    const pdfPath = path.join(__dirname, 'SADED_SYSTEM_DOCUMENTATION.pdf');
    
    // Try to find Chrome in common locations
    const possibleChromePaths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
    ];
    
    let executablePath = null;
    const fs = require('fs');
    for (const chromePath of possibleChromePaths) {
      if (fs.existsSync(chromePath)) {
        executablePath = chromePath;
        break;
      }
    }
    
    const pdf = await mdToPdf(
      { path: markdownPath },
      {
        launch_options: executablePath ? { executablePath } : undefined,
        pdf_options: {
          format: 'A4',
          margin: {
            top: '20mm',
            right: '15mm',
            bottom: '20mm',
            left: '15mm',
          },
          printBackground: true,
        },
        stylesheet: path.join(__dirname, 'pdf-styles.css'),
      }
    );

    if (pdf) {
      const fs = require('fs');
      fs.writeFileSync(pdfPath, pdf.content);
      console.log(`PDF created successfully: ${pdfPath}`);
    }
  } catch (error) {
    console.error('Error converting to PDF:', error);
    process.exit(1);
  }
}

convert();

