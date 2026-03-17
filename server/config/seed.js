require('dotenv').config();
const mongoose     = require('mongoose');
const { v4: uuid } = require('uuid');
const QRCode       = require('qrcode');

const User         = require('../models/User');
const Event        = require('../models/Event');
const Registration = require('../models/Registration');
const Certificate  = require('../models/Certificate');
const Feedback     = require('../models/Feedback');
const EntryLog     = require('../models/EntryLog');
const { generateCertificate } = require('../utils/certificateGenerator');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/universe_geu');
  console.log('Connected to MongoDB\n');

  await Promise.all([
    User.deleteMany({}), Event.deleteMany({}), Registration.deleteMany({}),
    Certificate.deleteMany({}), Feedback.deleteMany({}), EntryLog.deleteMany({}),
  ]);
  console.log('Cleared all collections');

  // ── Users ──────────────────────────────────────────────
  const admin = await User.create({ name:'Admin GEU',    email:'admin@geu.ac.in',  password:'admin123',     role:'admin',     collegeId:'ADMIN001', department:'Administration' });
  const org1  = await User.create({ name:'Prof. Sharma', email:'sharma@geu.ac.in', password:'organizer123', role:'organizer', collegeId:'FAC001',   department:'Computer Science and Engineering' });
  const org2  = await User.create({ name:'Prof. Verma',  email:'verma@geu.ac.in',  password:'organizer123', role:'organizer', collegeId:'FAC002',   department:'Electronics and Communication Engineering' });

  const s1 = await User.create({ name:'Dhruv Rawat',  email:'dhruv@geu.ac.in',  password:'student123', role:'student', collegeId:'230211487', department:'Computer Science and Engineering' });
  const s2 = await User.create({ name:'Ayush Gupta',  email:'ayush@geu.ac.in',  password:'student123', role:'student', collegeId:'23021152',  department:'Computer Science and Engineering' });
  const s3 = await User.create({ name:'Sujal Verma',  email:'sujal@geu.ac.in',  password:'student123', role:'student', collegeId:'230213768', department:'Computer Science and Engineering' });
  const s4 = await User.create({ name:'Sachin Rawat', email:'sachin@geu.ac.in', password:'student123', role:'student', collegeId:'230211078', department:'Computer Science and Engineering' });
  const s5 = await User.create({ name:'Priya Singh',  email:'priya@geu.ac.in',  password:'student123', role:'student', collegeId:'230211500', department:'Electronics and Communication Engineering' });
  const s6 = await User.create({ name:'Rahul Kumar',  email:'rahul@geu.ac.in',  password:'student123', role:'student', collegeId:'230211501', department:'Mechanical Engineering' });
  console.log('✅ Users created');

  // ── Date helpers ───────────────────────────────────────
  const now      = new Date();
  // today at midnight (for date comparison)
  const today    = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d = days => new Date(today.getTime() + days * 864e5);

  // ── Events ─────────────────────────────────────────────

  // 🟢 ONGOING — happening TODAY (auto-detected by syncEventStatus)
  const evToday = await Event.create({
    title:           'Python Bootcamp — Day 1',
    description:     'Full-day Python bootcamp covering basics to advanced topics. Live coding sessions with hands-on exercises.',
    date:            today,           // ← today's date
    time:            '09:00',
    venue:           'CS Block, Lab 201',
    organizer:       org1._id,
    capacity:        60,
    registeredCount: 0,
    category:        'Workshop',
    status:          'ongoing',       // ← set directly for reliability
    department:      'Computer Science and Engineering',
    tags:            ['python', 'bootcamp', 'coding'],
  });

  // 🔵 UPCOMING — future events
  const evHack = await Event.create({
    title:'GEU Hackathon 2025', description:'Annual 24-hour hackathon. Build innovative solutions. Prizes ₹1,00,000!',
    date:d(3), time:'09:00', venue:'CS Block, Lab 301', organizer:org1._id,
    capacity:200, registeredCount:0, category:'Technical', status:'upcoming',
    department:'Computer Science and Engineering', tags:['hackathon','coding'],
  });

  const evAI = await Event.create({
    title:'AI & ML Workshop', description:'Hands-on workshop on AI, Machine Learning and Python.',
    date:d(7), time:'10:00', venue:'Seminar Hall A', organizer:org1._id,
    capacity:80, registeredCount:0, category:'Workshop', status:'upcoming',
    department:'Computer Science and Engineering', tags:['AI','ML'],
  });

  const evFest = await Event.create({
    title:'GRAFEST 2025', description:"GEU's annual mega tech & cultural festival. 3 days of competitions!",
    date:d(14), time:'08:00', venue:'Main Campus Ground', organizer:org2._id,
    capacity:5000, registeredCount:0, category:'Fest', status:'upcoming',
    department:'All Departments', tags:['fest','GRAFEST'],
  });

  // 🔴 COMPLETED — past events (with attendance + certs)
  const evBlock = await Event.create({
    title:'Blockchain 101 Seminar', description:'Introduction to Blockchain, cryptocurrency, and Web3.',
    date:d(-7), time:'14:00', venue:'Seminar Hall B', organizer:org1._id,
    capacity:60, registeredCount:0, category:'Seminar', status:'completed',
    department:'Computer Science and Engineering', tags:['blockchain','web3'],
  });

  const evUX = await Event.create({
    title:'UX Design Sprint', description:'Intensive 2-day design sprint. Open to all branches.',
    date:d(-3), time:'10:00', venue:'Design Lab C', organizer:org2._id,
    capacity:40, registeredCount:0, category:'Workshop', status:'completed',
    department:'All Departments', tags:['design','UX'],
  });

  console.log('✅ Events created');
  console.log(`   Today (ongoing): ${evToday.title}`);
  console.log(`   Upcoming x3, Completed x2`);

  // ── Registrations for TODAY event (s1, s2, s3 registered) ──────
  const todayTokens = {};
  for (const s of [s1, s2, s3]) {
    const token = uuid();
    const qr    = await QRCode.toDataURL(JSON.stringify({ token, eventId:evToday._id.toString(), userId:s._id.toString() }));
    await Registration.create({ user:s._id, event:evToday._id, qrToken:token, qrCode:qr, status:'registered' });
    await Event.findByIdAndUpdate(evToday._id, { $inc:{ registeredCount:1 } });
    todayTokens[s.name] = token;
  }

  // ── Registrations for UPCOMING Hackathon (s1, s2 registered) ───
  const hackTokens = {};
  for (const s of [s1, s2]) {
    const token = uuid();
    const qr    = await QRCode.toDataURL(JSON.stringify({ token, eventId:evHack._id.toString(), userId:s._id.toString() }));
    await Registration.create({ user:s._id, event:evHack._id, qrToken:token, qrCode:qr, status:'registered' });
    await Event.findByIdAndUpdate(evHack._id, { $inc:{ registeredCount:1 } });
    hackTokens[s.name] = token;
  }

  // s3 registered for AI Workshop
  const aiToken = uuid();
  const aiQR    = await QRCode.toDataURL(JSON.stringify({ token:aiToken, eventId:evAI._id.toString(), userId:s3._id.toString() }));
  await Registration.create({ user:s3._id, event:evAI._id, qrToken:aiToken, qrCode:aiQR, status:'registered' });
  await Event.findByIdAndUpdate(evAI._id, { $inc:{ registeredCount:1 } });

  console.log('✅ Upcoming + today registrations created');

  // ── Completed event attendance (Blockchain: s1,s2,s3 attended) ─
  for (const [s, attended] of [[s1,true],[s2,true],[s3,true],[s4,false]]) {
    const token = uuid();
    const qr    = await QRCode.toDataURL(JSON.stringify({ token, eventId:evBlock._id.toString(), userId:s._id.toString() }));
    const reg   = await Registration.create({
      user:s._id, event:evBlock._id, qrToken:token, qrCode:qr,
      attended, attendedAt: attended ? d(-7) : undefined,
      checkedInBy: attended ? org1._id : undefined,
      status: attended ? 'attended' : 'registered',
    });
    await Event.findByIdAndUpdate(evBlock._id, { $inc:{ registeredCount:1 } });
    if (attended) await EntryLog.create({ user:s._id, event:evBlock._id, qrToken:token, status:'allowed', scannedBy:org1._id, timestamp:d(-7) });
  }
  // fake/duplicate logs
  await EntryLog.create({ event:evBlock._id, qrToken:'fake-001', status:'denied',    reason:'Invalid QR',   scannedBy:org1._id });
  await EntryLog.create({ user:s1._id, event:evBlock._id, status:'duplicate', reason:'Already scanned', scannedBy:org1._id });

  // UX Sprint: s4,s5,s6 attended; s1 no-show
  for (const [s, attended] of [[s4,true],[s5,true],[s6,true],[s1,false]]) {
    const token = uuid();
    const qr    = await QRCode.toDataURL(JSON.stringify({ token, eventId:evUX._id.toString(), userId:s._id.toString() }));
    await Registration.create({
      user:s._id, event:evUX._id, qrToken:token, qrCode:qr,
      attended, attendedAt: attended ? d(-3) : undefined,
      checkedInBy: attended ? org2._id : undefined,
      status: attended ? 'attended' : 'registered',
    });
    await Event.findByIdAndUpdate(evUX._id, { $inc:{ registeredCount:1 } });
    if (attended) await EntryLog.create({ user:s._id, event:evUX._id, qrToken:token, status:'allowed', scannedBy:org2._id, timestamp:d(-3) });
  }
  console.log('✅ Completed event attendance marked');

  // ── Certificates for Blockchain attendees (s1, s2, s3) ─────────
  for (const s of [s1, s2, s3]) {
    const reg    = await Registration.findOne({ user:s._id, event:evBlock._id });
    const certId = `GEU-${evBlock._id.toString().slice(-6).toUpperCase()}-${uuid().slice(0,8).toUpperCase()}`;
    try {
      const fileUrl = await generateCertificate({ user:s, event:evBlock, certId });
      await Certificate.create({ user:s._id, event:evBlock._id, registration:reg._id, certificateId:certId, fileUrl });
    } catch {
      await Certificate.create({ user:s._id, event:evBlock._id, registration:reg._id, certificateId:certId, fileUrl:'' });
    }
  }
  // UX Sprint certs (s4, s5, s6) — intentionally NOT issuing s6 to demo "pending"
  for (const s of [s4, s5]) {
    const reg    = await Registration.findOne({ user:s._id, event:evUX._id });
    const certId = `GEU-${evUX._id.toString().slice(-6).toUpperCase()}-${uuid().slice(0,8).toUpperCase()}`;
    try {
      const fileUrl = await generateCertificate({ user:s, event:evUX, certId });
      await Certificate.create({ user:s._id, event:evUX._id, registration:reg._id, certificateId:certId, fileUrl });
    } catch {
      await Certificate.create({ user:s._id, event:evUX._id, registration:reg._id, certificateId:certId, fileUrl:'' });
    }
  }
  // s6 (Rahul) attended UX Sprint but cert NOT issued → shows in Pending tab
  console.log('✅ Certificates generated (s6/Rahul left pending on purpose)');

  // ── Sample feedback ─────────────────────────────────────────────
  await Feedback.create({ user:s1._id, event:evBlock._id, rating:5, comment:'Excellent! Learned a lot about blockchain.' });
  await Feedback.create({ user:s2._id, event:evBlock._id, rating:4, comment:'Very informative. More hands-on exercises please.' });
  await Feedback.create({ user:s3._id, event:evBlock._id, rating:5, comment:'Best seminar this semester!' });
  await Feedback.create({ user:s4._id, event:evUX._id,   rating:4, comment:'Great sprint. Loved the collaborative approach.' });
  await Feedback.create({ user:s5._id, event:evUX._id,   rating:5, comment:'Amazing experience!' });
  console.log('✅ Sample feedback added');

  // ── Print guide ─────────────────────────────────────────────────
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║           SEED COMPLETE — UniVerse GEU                       ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log('║  LOGIN CREDENTIALS                                           ║');
  console.log('║  Admin     : admin@geu.ac.in      / admin123                 ║');
  console.log('║  Organizer : sharma@geu.ac.in     / organizer123             ║');
  console.log('║  Student   : dhruv@geu.ac.in      / student123               ║');
  console.log('║  Student   : sachin@geu.ac.in     / student123               ║');
  console.log('║  Student   : rahul@geu.ac.in      / student123               ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log('║  WHAT TO TEST                                                ║');
  console.log('║                                                              ║');
  console.log('║  1. ONGOING EVENT (today):                                   ║');
  console.log('║     → Browse Events → Python Bootcamp shows as "ongoing"     ║');
  console.log('║                                                              ║');
  console.log('║  2. QR SCAN (today event — Python Bootcamp):                 ║');
  console.log('║     → Login: sharma@geu.ac.in (organizer)                    ║');
  console.log('║     → Scan QR → select Python Bootcamp                       ║');
  console.log(`║     → Token (Dhruv):  ${todayTokens['Dhruv Rawat']}  ║`);
  console.log(`║     → Token (Ayush):  ${todayTokens['Ayush Gupta']}  ║`);
  console.log('║                                                              ║');
  console.log('║  3. CERTIFICATE (already issued):                            ║');
  console.log('║     → Login: dhruv@geu.ac.in → Certificates                  ║');
  console.log('║     → Download cert for Blockchain 101 Seminar               ║');
  console.log('║                                                              ║');
  console.log('║  4. CERT PENDING (attended, not yet issued):                 ║');
  console.log('║     → Login: rahul@geu.ac.in → Certificates → Pending tab   ║');
  console.log('║     → UX Design Sprint cert pending                          ║');
  console.log('║     → Then login as organizer → Dashboard → Issue Certs      ║');
  console.log('║                                                              ║');
  console.log('║  5. ANALYTICS:                                               ║');
  console.log('║     → Login organizer → Analytics → Blockchain Seminar       ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
