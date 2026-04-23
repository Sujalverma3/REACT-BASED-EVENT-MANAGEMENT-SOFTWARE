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

  // 🟢 ONGOING — happening TODAY
  const evToday = await Event.create({
    title:           'Python Bootcamp — Day 1',
    description:     'Full-day Python bootcamp covering basics to advanced topics. Live coding sessions with hands-on exercises.',
    date:            today,
    time:            '09:00',
    venue:           'CS Block, Lab 201',
    organizer:       org1._id,
    capacity:        60,
    registeredCount: 0,
    category:        'Workshop',
    status:          'ongoing',
    department:      'Computer Science and Engineering',
    tags:            ['python', 'bootcamp', 'coding'],
    club:            'ByteForge Club',
  });

  // ─── ByteForge Club ───────────────────────────────────
  const evHack = await Event.create({
    title:'GEU Hackathon 2025',
    description:'Annual 24-hour hackathon. Build innovative solutions. Prizes worth ₹1,00,000! Open to all GEU students.',
    date:d(3), time:'09:00', venue:'CS Block, Lab 301', organizer:org1._id,
    capacity:200, registeredCount:0, category:'Technical', status:'upcoming',
    department:'Computer Science and Engineering', tags:['hackathon','coding'],
    club:'ByteForge Club',
  });

  const evAI = await Event.create({
    title:'AI & ML Workshop',
    description:'Hands-on workshop on Artificial Intelligence, Machine Learning, and Python. Build your first neural network!',
    date:d(7), time:'10:00', venue:'Seminar Hall A', organizer:org1._id,
    capacity:80, registeredCount:0, category:'Workshop', status:'upcoming',
    department:'Computer Science and Engineering', tags:['AI','ML','python'],
    club:'ByteForge Club',
  });

  const evOpenSource = await Event.create({
    title:'Open Source Contribution Sprint',
    description:'ByteForge presents a full-day open-source sprint. Contribute to real GitHub projects, win swag, and grow your portfolio.',
    date:d(10), time:'10:00', venue:'CS Block, Lab 104', organizer:org1._id,
    capacity:50, registeredCount:0, category:'Club Activity', status:'upcoming',
    department:'Computer Science and Engineering', tags:['open-source','github','coding'],
    club:'ByteForge Club',
  });

  // ─── RoboCraft Club ───────────────────────────────────
  const evRobo = await Event.create({
    title:'Robo-War Championship 2025',
    description:"Build a battle bot and compete in GEU's premier robotics arena! Team event (2-4 members). Exciting cash prizes await.",
    date:d(5), time:'11:00', venue:'ECE Workshop, Block B', organizer:org2._id,
    capacity:120, registeredCount:0, category:'Technical', status:'upcoming',
    department:'Electronics and Communication Engineering', tags:['robotics','competition','bots'],
    club:'RoboCraft Club',
  });

  const evIoT = await Event.create({
    title:'IoT Masterclass: Smart Campus',
    description:'Hands-on session on IoT, Arduino, and Raspberry Pi. Build a smart device from scratch and take it home!',
    date:d(9), time:'09:30', venue:'ECE Lab 302', organizer:org2._id,
    capacity:40, registeredCount:0, category:'Workshop', status:'upcoming',
    department:'Electronics and Communication Engineering', tags:['IoT','Arduino','electronics'],
    club:'RoboCraft Club',
  });

  const evCircuit = await Event.create({
    title:'Circuit Design Challenge',
    description:"RoboCraft's annual circuit design contest. Design, simulate, and present your PCB layout to a panel of faculty judges.",
    date:d(12), time:'10:00', venue:'ECE Seminar Room', organizer:org2._id,
    capacity:60, registeredCount:0, category:'Club Activity', status:'upcoming',
    department:'Electronics and Communication Engineering', tags:['circuit','PCB','electronics'],
    club:'RoboCraft Club',
  });

  // ─── ArtWave Club ─────────────────────────────────────
  const evFest = await Event.create({
    title:'GRAFEST 2025 — Cultural Night',
    description:"GEU's annual mega cultural festival! Dance, music, drama, and art competitions. Three nights of unforgettable performances.",
    date:d(14), time:'18:00', venue:'Main Campus Amphitheatre', organizer:org2._id,
    capacity:5000, registeredCount:0, category:'Fest', status:'upcoming',
    department:'All Departments', tags:['fest','GRAFEST','cultural'],
    club:'ArtWave Club',
  });

  const evPhoto = await Event.create({
    title:'Campus Photography Contest — Lens & Life',
    description:'Capture the soul of GEU campus in a photo. Submit digitally; top 10 entries get gallery display and prizes.',
    date:d(6), time:'08:00', venue:'Campus-wide + Online Submission', organizer:org2._id,
    capacity:200, registeredCount:0, category:'Club Activity', status:'upcoming',
    department:'All Departments', tags:['photography','art','creative'],
    club:'ArtWave Club',
  });

  const evDrama = await Event.create({
    title:'Street Play Competition — Nukkad Natak',
    description:"ArtWave's inter-college street play fest. Powerful 15-minute performances on social themes. Judges from professional theatre.",
    date:d(11), time:'15:00', venue:'Open Air Theatre, GEU Campus', organizer:org2._id,
    capacity:300, registeredCount:0, category:'Cultural', status:'upcoming',
    department:'All Departments', tags:['drama','street-play','theatre'],
    club:'ArtWave Club',
  });

  // ─── GreenEarth Club ──────────────────────────────────
  const evEco = await Event.create({
    title:'Eco-Hackathon: Solve for SDGs',
    description:'Build solutions for UN Sustainable Development Goals. Mentored by industry experts. Top teams get incubation support.',
    date:d(8), time:'09:00', venue:'Innovation Hub, Block A', organizer:org1._id,
    capacity:100, registeredCount:0, category:'Technical', status:'upcoming',
    department:'All Departments', tags:['sustainability','SDG','hackathon','environment'],
    club:'GreenEarth Club',
  });

  const evPlant = await Event.create({
    title:'Plantation Drive — Green GEU',
    description:'Join GreenEarth as we plant 500 saplings across the GEU campus. Certificates of participation for all volunteers.',
    date:d(4), time:'07:00', venue:'GEU Campus Grounds', organizer:org1._id,
    capacity:250, registeredCount:0, category:'Club Activity', status:'upcoming',
    department:'All Departments', tags:['plantation','green','environment','volunteering'],
    club:'GreenEarth Club',
  });

  const evEnergy = await Event.create({
    title:'Campus Energy Audit Workshop',
    description:'Learn how to conduct an energy audit. GreenEarth will audit 3 campus buildings live. Includes TERI partner certification.',
    date:d(13), time:'10:00', venue:'Civil Engineering Seminar Hall', organizer:org2._id,
    capacity:60, registeredCount:0, category:'Workshop', status:'upcoming',
    department:'All Departments', tags:['energy','sustainability','audit'],
    club:'GreenEarth Club',
  });

  // ─── COMPLETED past events ────────────────────────────
  const evBlock = await Event.create({
    title:'Blockchain 101 Seminar', description:'Introduction to Blockchain, cryptocurrency, and Web3.',
    date:d(-7), time:'14:00', venue:'Seminar Hall B', organizer:org1._id,
    capacity:60, registeredCount:0, category:'Seminar', status:'completed',
    department:'Computer Science and Engineering', tags:['blockchain','web3'],
    club:'ByteForge Club',
  });

  const evUX = await Event.create({
    title:'UX Design Sprint', description:'Intensive 2-day design sprint. Open to all branches.',
    date:d(-3), time:'10:00', venue:'Design Lab C', organizer:org2._id,
    capacity:40, registeredCount:0, category:'Workshop', status:'completed',
    department:'All Departments', tags:['design','UX'],
    club:'ArtWave Club',
  });

  console.log('✅ Events created');
  console.log(`   Today (ongoing) : ${evToday.title}`);
  console.log(`   ByteForge (3)   : Hackathon · AI Workshop · Open Source Sprint`);
  console.log(`   RoboCraft (3)   : Robo-War · IoT Masterclass · Circuit Design`);
  console.log(`   ArtWave   (3)   : GRAFEST · Photography · Street Play`);
  console.log(`   GreenEarth (3)  : Eco-Hackathon · Plantation Drive · Energy Audit`);
  console.log(`   Completed  (2)  : Blockchain Seminar · UX Sprint`);

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
  console.log('║  4 CLUBS SEEDED                                              ║');
  console.log('║  💻 ByteForge Club   — Mentor: Prof. Rajesh Sharma (CSE)     ║');
  console.log('║     Events: Hackathon · AI Workshop · Open Source Sprint     ║');
  console.log('║  🤖 RoboCraft Club   — Mentor: Prof. Anita Verma (ECE)       ║');
  console.log('║     Events: Robo-War · IoT Masterclass · Circuit Design      ║');
  console.log('║  🎨 ArtWave Club     — Mentor: Prof. Kavita Mehta (Hum.)     ║');
  console.log('║     Events: GRAFEST · Photography · Street Play              ║');
  console.log('║  🌱 GreenEarth Club  — Mentor: Prof. Manish Joshi (Civil)    ║');
  console.log('║     Events: Eco-Hackathon · Plantation Drive · Energy Audit  ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log('║  WHAT TO TEST                                                ║');
  console.log('║                                                              ║');
  console.log('║  1. CLUBS PAGE:                                              ║');
  console.log('║     → Navigate to /clubs → view all 4 clubs                  ║');
  console.log('║     → Click any club → expand with mentor details            ║');
  console.log('║     → "View Events" → filtered by that club                  ║');
  console.log('║                                                              ║');
  console.log('║  2. CLUB FILTER ON EVENTS PAGE:                              ║');
  console.log('║     → /events → click club pills (ByteForge, RoboCraft…)     ║');
  console.log('║     → Club badge + mentor surname shown on each card         ║');
  console.log('║                                                              ║');
  console.log('║  3. EVENT DETAIL — CLUB CARD:                                ║');
  console.log('║     → Click any club event → right sidebar shows club logo   ║');
  console.log('║     → Mentor name, designation, and club tagline visible     ║');
  console.log('║                                                              ║');
  console.log('║  4. ONGOING EVENT (today):                                   ║');
  console.log('║     → Browse Events → Python Bootcamp shows as "ongoing"     ║');
  console.log('║                                                              ║');
  console.log('║  5. QR SCAN (today event — Python Bootcamp):                 ║');
  console.log('║     → Login: sharma@geu.ac.in (organizer)                    ║');
  console.log(`║     → Token (Dhruv):  ${todayTokens['Dhruv Rawat']}  ║`);
  console.log(`║     → Token (Ayush):  ${todayTokens['Ayush Gupta']}  ║`);
  console.log('║                                                              ║');
  console.log('║  6. CERTIFICATE (already issued):                            ║');
  console.log('║     → Login: dhruv@geu.ac.in → Certificates                  ║');
  console.log('║     → Download cert for Blockchain 101 Seminar (ByteForge)   ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
