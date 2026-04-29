const fs   = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../uploads/certificates');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const generateCertificate = ({ user, event, certId }) =>
  new Promise((resolve, reject) => {
    const PDFDocument = require('pdfkit');
    const file = path.join(dir, `${certId}.pdf`);
    const doc  = new PDFDocument({ 
      size: 'A4', 
      layout: 'landscape', 
      margin: 0,
      info: {
        Title: `${event.title} - Certificate`,
        Author: 'UniVerse GEU'
      }
    });
    const out  = fs.createWriteStream(file);
    doc.pipe(out);

    const W = 841.89, H = 595.28;
    const dateStr = new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    // Background
    doc.rect(0, 0, W, H).fill('#fffdf9');
    // Borders
    doc.rect(16, 16, W-32, H-32).lineWidth(6).stroke('#8B1A1A');
    doc.rect(24, 24, W-48, H-48).lineWidth(1.5).stroke('#C9963A');
    // Header band
    doc.rect(16, 16, W-32, 70).fill('#8B1A1A');

    // Logo box
    doc.roundedRect(46, 24, 50, 50, 6).fill('#fff');
    doc.fontSize(20).fillColor('#8B1A1A').font('Helvetica-Bold').text('GE', 46, 38, { width: 50, align: 'center' });

    // University name
    doc.fontSize(14).fillColor('#fff').font('Helvetica-Bold')
       .text('Graphic Era (Deemed to be University)', 112, 30, { width: W-160 });
    doc.fontSize(9).fillColor('rgba(255,255,255,0.7)').font('Helvetica')
       .text('Dehradun, Uttarakhand  ·  NAAC A+  ·  Est. 1993', 112, 50, { width: W-160 });

    // Gold line
    doc.moveTo(55, 104).lineTo(W-55, 104).lineWidth(1).stroke('#C9963A');

    // Certificate of Participation
    doc.fontSize(10).fillColor('#C9963A').font('Helvetica-Bold')
       .text('C E R T I F I C A T E   O F   P A R T I C I P A T I O N', 55, 118, { width: W-110, align: 'center' });

    doc.fontSize(12).fillColor('#666').font('Helvetica')
       .text('This is to certify that', 55, 148, { width: W-110, align: 'center' });

    // Name
    doc.fontSize(34).fillColor('#8B1A1A').font('Helvetica-Bold')
       .text(user.name, 55, 168, { width: W-110, align: 'center' });

    // Underline
    const nw = Math.min(doc.widthOfString(user.name, { fontSize: 34 })+20, W-160);
    const nx = (W - nw) / 2;
    doc.moveTo(nx, 210).lineTo(nx+nw, 210).lineWidth(1).stroke('#C9963A');

    doc.fontSize(10).fillColor('#888').font('Helvetica')
       .text(`College ID: ${user.collegeId}  ·  ${user.department}`, 55, 218, { width: W-110, align: 'center' });

    doc.fontSize(12).fillColor('#555').font('Helvetica')
       .text('has successfully participated in', 55, 244, { width: W-110, align: 'center' });

    doc.fontSize(20).fillColor('#1a1a1a').font('Helvetica-Bold')
       .text(event.title, 80, 264, { width: W-160, align: 'center' });

    doc.fontSize(11).fillColor('#666').font('Helvetica')
       .text(`held on ${dateStr}  ·  ${event.venue}`, 80, 294, { width: W-160, align: 'center' });

    // Signature lines
    const sy = 375;
    [[110, 'Event Organizer'], [W-290, 'Dean of Students']].forEach(([x, label]) => {
      doc.moveTo(x, sy).lineTo(x+170, sy).lineWidth(0.8).stroke('#8B1A1A');
      doc.fontSize(10).fillColor('#333').font('Helvetica-Bold').text(label, x, sy+7, { width: 170, align: 'center' });
      doc.fontSize(9).fillColor('#999').font('Helvetica').text('Graphic Era University', x, sy+21, { width: 170, align: 'center' });
    });

    // Footer
    doc.moveTo(55, H-50).lineTo(W-55, H-50).lineWidth(0.6).stroke('#C9963A');
    doc.fontSize(8).fillColor('#aaa').font('Helvetica')
       .text(`Certificate ID: ${certId}  ·  Verify at universe.geu.ac.in/verify/${certId}`, 55, H-42, { width: W-110, align: 'center' });
    doc.fontSize(7).fillColor('#ccc').font('Helvetica')
       .text('NAAC A+  ·  NIRF Top 50  ·  geu.ac.in', 55, H-30, { width: W-110, align: 'center' });

    doc.end();
    out.on('finish', () => resolve(`/uploads/certificates/${certId}.pdf`));
    out.on('error', reject);
  });

module.exports = { generateCertificate };
