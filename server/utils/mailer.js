const nodemailer = require('nodemailer');
const path       = require('path');
const fs         = require('fs');

const transport = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: +process.env.SMTP_PORT || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const base = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border-radius:10px;overflow:hidden;border:1px solid #e5e0d8">
    <div style="background:#8B1A1A;padding:20px 28px">
      <div style="font-size:20px;font-weight:800;color:#fff;font-family:Georgia,serif">Uni<span style="color:#C9963A">Verse</span> GEU</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.6);margin-top:2px">Graphic Era University · Campus Event Portal</div>
    </div>
    BODY
    <div style="background:#fdf0f0;padding:14px 28px;font-size:11px;color:#999;text-align:center">
      Graphic Era (Deemed to be University) · Dehradun · NAAC A+<br>
      This is an automated message from UniVerse GEU.
    </div>
  </div>`;

exports.sendEventReminder = async ({ user, event }) => {
  const d = new Date(event.date).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const body = `
    <div style="padding:28px">
      <p style="font-size:15px;color:#333">Hi <strong>${user.name}</strong>,</p>
      <p style="font-size:14px;color:#555;margin:12px 0">Reminder: you are registered for <strong style="color:#8B1A1A">${event.title}</strong>.</p>
      <div style="background:#fdf8f2;border-left:4px solid #8B1A1A;padding:14px 18px;border-radius:6px;margin:16px 0;font-size:13px;color:#555">
        <div>📅 <b>Date:</b> ${d}</div>
        <div>⏰ <b>Time:</b> ${event.time}</div>
        <div>📍 <b>Venue:</b> ${event.venue}</div>
      </div>
      <p style="font-size:13px;color:#888">Carry your QR code (from the UniVerse portal) for attendance.</p>
    </div>`;
  await transport().sendMail({
    from: process.env.EMAIL_FROM || 'UniVerse GEU <noreply@geu.ac.in>',
    to: user.email,
    subject: `Reminder: ${event.title} is tomorrow`,
    html: base.replace('BODY', body),
  });
};

exports.sendCertificateEmail = async ({ user, event, certId, fileUrl }) => {
  const attachments = [];
  if (fileUrl) {
    const abs = path.join(__dirname, '..', fileUrl);
    if (fs.existsSync(abs)) attachments.push({ filename: `Certificate_${certId}.pdf`, path: abs });
  }
  const body = `
    <div style="padding:28px;text-align:center">
      <div style="font-size:44px;margin-bottom:14px">🏆</div>
      <h2 style="font-family:Georgia,serif;color:#8B1A1A;margin-bottom:8px">Congratulations, ${user.name}!</h2>
      <p style="font-size:14px;color:#555;margin-bottom:18px">Your certificate for <strong style="color:#8B1A1A">${event.title}</strong> is attached.</p>
      <div style="background:#fdf8f2;border-radius:8px;padding:14px;display:inline-block">
        <div style="font-size:11px;color:#aaa">Certificate ID</div>
        <div style="font-size:14px;font-weight:700;color:#8B1A1A;font-family:monospace">${certId}</div>
      </div>
    </div>`;
  await transport().sendMail({
    from: process.env.EMAIL_FROM || 'UniVerse GEU <noreply@geu.ac.in>',
    to: user.email,
    subject: `Your Certificate — ${event.title}`,
    html: base.replace('BODY', body),
    attachments,
  });
};
