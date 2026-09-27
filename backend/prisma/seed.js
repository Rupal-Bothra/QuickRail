import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function getNext7Days() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

async function main() {
  console.log('🌱 Starting database seed with standardized station names & Rajasthan route coverage...');

  // Clean existing data
  await prisma.payment.deleteMany();
  await prisma.passenger.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.seatInventory.deleteMany();
  await prisma.route.deleteMany();
  await prisma.train.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const hashedPasswordUser = await bcrypt.hash('user123', 10);
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);

  const demoUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: hashedPasswordUser,
      phone: '+91 9876543210',
      role: 'USER',
    },
  });

  const demoAdmin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@quickrail.com',
      password_hash: hashedPasswordAdmin,
      phone: '+91 9999988888',
      role: 'ADMIN',
    },
  });

  console.log(`✅ Users created: ${demoUser.email}, ${demoAdmin.email}`);

  // Standardized Trains List (including Rajasthan coverage)
  const trainsData = [
    // --- RAJASTHAN ROUTES & INTERCITY CONNECTIVITY ---
    {
      train_number: '12015',
      name: 'New Delhi - Ajmer Shatabdi Express',
      source: 'New Delhi (NDLS)',
      destination: 'Ajmer Jn (AII)',
      departure_time: '06:10',
      arrival_time: '12:55',
      duration: '06h 45m',
      classes_available: 'CC,EC',
      distance: 444,
      stops: [
        { station: 'Gurgaon (GGN)', arrival: '06:58', departure: '07:00', distance: 31 },
        { station: 'Alwar Jn (AWR)', arrival: '08:47', departure: '08:50', distance: 157 },
        { station: 'Jaipur Jn (JP)', arrival: '10:40', departure: '10:45', distance: 308 },
        { station: 'Kishangarh (KSG)', arrival: '12:08', departure: '12:10', distance: 419 },
      ],
    },
    {
      train_number: '20977',
      name: 'Ajmer - Delhi Cantt Vande Bharat Express',
      source: 'Ajmer Jn (AII)',
      destination: 'Delhi Cantt (DEC)',
      departure_time: '06:20',
      arrival_time: '11:35',
      duration: '05h 15m',
      classes_available: 'CC,EC',
      distance: 428,
      stops: [
        { station: 'Jaipur Jn (JP)', arrival: '07:50', departure: '07:55', distance: 135 },
        { station: 'Alwar Jn (AWR)', arrival: '09:35', departure: '09:37', distance: 286 },
        { station: 'Gurgaon (GGN)', arrival: '11:15', departure: '11:17', distance: 412 },
      ],
    },
    {
      train_number: '12992',
      name: 'Jaipur - Udaipur City Intercity Express',
      source: 'Jaipur Jn (JP)',
      destination: 'Udaipur City (UDZ)',
      departure_time: '14:00',
      arrival_time: '21:35',
      duration: '07h 35m',
      classes_available: 'CC,3A,SL,2S',
      distance: 430,
      stops: [
        { station: 'Kishangarh (KSG)', arrival: '15:23', departure: '15:25', distance: 109 },
        { station: 'Ajmer Jn (AII)', arrival: '16:05', departure: '16:15', distance: 135 },
        { station: 'Bhilwara (BHL)', arrival: '18:00', departure: '18:05', distance: 267 },
        { station: 'Chittorgarh Jn (COR)', arrival: '19:15', departure: '19:30', distance: 321 },
      ],
    },
    {
      train_number: '22478',
      name: 'Jaipur - Jodhpur Vande Bharat Express',
      source: 'Jaipur Jn (JP)',
      destination: 'Jodhpur Jn (JU)',
      departure_time: '05:45',
      arrival_time: '10:15',
      duration: '04h 30m',
      classes_available: 'CC,EC',
      distance: 310,
      stops: [
        { station: 'Phulera Jn (FL)', arrival: '06:25', departure: '06:27', distance: 55 },
        { station: 'Ajmer Jn (AII)', arrival: '07:20', departure: '07:25', distance: 135 },
        { station: 'Marwar Jn (MJ)', arrival: '08:50', departure: '08:52', distance: 239 },
      ],
    },
    {
      train_number: '12465',
      name: 'Ranthambore Superfast Express',
      source: 'Jaipur Jn (JP)',
      destination: 'Jodhpur Jn (JU)',
      departure_time: '17:00',
      arrival_time: meTime('22:15'),
      duration: '05h 15m',
      classes_available: '3A,SL,2S',
      distance: 310,
      stops: [
        { station: 'Phulera Jn (FL)', arrival: '17:45', departure: '17:47', distance: 55 },
        { station: 'Makrana Jn (MKN)', arrival: '18:40', departure: '18:43', distance: 119 },
        { station: 'Degana Jn (DNA)', arrival: '19:17', departure: '19:20', distance: 163 },
        { station: 'Merta Road Jn (MTD)', arrival: '19:55', departure: '20:00', distance: 207 },
      ],
    },
    {
      train_number: '12986',
      name: 'Delhi Sarai Rohilla Double Decker Express',
      source: 'Jaipur Jn (JP)',
      destination: 'Delhi Sarai Rohilla (DEE)',
      departure_time: '06:00',
      arrival_time: '10:30',
      duration: '04h 30m',
      classes_available: 'CC',
      distance: 303,
      stops: [
        { station: 'Alwar Jn (AWR)', arrival: '07:48', departure: '07:51', distance: 151 },
        { station: 'Gurgaon (GGN)', arrival: meTime('09:36'), departure: '09:38', distance: 276 },
      ],
    },

    // --- MAJOR METRO & NATIONAL TRUNK ROUTES ---
    {
      train_number: '12952',
      name: 'New Delhi - Mumbai Rajdhani Express',
      source: 'New Delhi (NDLS)',
      destination: 'Mumbai Central (MMCT)',
      departure_time: '16:55',
      arrival_time: '08:35',
      duration: '15h 40m',
      classes_available: '1A,2A,3A',
      distance: 1384,
      stops: [
        { station: 'Kota Jn (KOTA)', arrival: '21:35', departure: '21:45', distance: 466 },
        { station: 'Ratlam Jn (RTM)', arrival: '00:35', departure: '00:40', distance: 733 },
        { station: 'Vadodara Jn (BRC)', arrival: '04:10', departure: '04:20', distance: 993 },
        { station: 'Surat (ST)', arrival: '05:53', departure: '05:58', distance: 1123 },
      ],
    },
    {
      train_number: '12302',
      name: 'Howrah Rajdhani Express',
      source: 'New Delhi (NDLS)',
      destination: 'Howrah Jn (HWH)',
      departure_time: '16:50',
      arrival_time: '09:55',
      duration: '17h 05m',
      classes_available: '1A,2A,3A',
      distance: 1447,
      stops: [
        { station: 'Kanpur Central (CNB)', arrival: '21:32', departure: '21:37', distance: 440 },
        { station: 'Prayagraj Jn (PRYJ)', arrival: '23:43', departure: '23:45', distance: 634 },
        { station: 'Pt. Deen Dayal Upadhyaya (DDU)', arrival: '01:45', departure: '01:55', distance: 787 },
        { station: 'Dhanbad Jn (DHN)', arrival: '06:00', departure: '06:05', distance: 1188 },
      ],
    },
    {
      train_number: '20901',
      name: 'Vande Bharat Express',
      source: 'Mumbai Central (MMCT)',
      destination: 'Ahmedabad Jn (ADI)',
      departure_time: '06:00',
      arrival_time: '11:25',
      duration: '05h 25m',
      classes_available: 'CC,EC',
      distance: 491,
      stops: [
        { station: 'Vapi (VAPI)', arrival: '07:34', departure: '07:36', distance: 168 },
        { station: 'Surat (ST)', arrival: '08:50', departure: '08:53', distance: 263 },
        { station: 'Vadodara Jn (BRC)', arrival: '10:13', departure: '10:16', distance: 393 },
      ],
    },
    {
      train_number: '22436',
      name: 'Varanasi Vande Bharat Express',
      source: 'New Delhi (NDLS)',
      destination: 'Varanasi Jn (BSB)',
      departure_time: '06:00',
      arrival_time: '14:00',
      duration: '08h 00m',
      classes_available: 'CC,EC',
      distance: 759,
      stops: [
        { station: 'Kanpur Central (CNB)', arrival: '10:08', departure: '10:10', distance: 440 },
        { station: 'Prayagraj Jn (PRYJ)', arrival: '12:08', departure: '12:10', distance: 634 },
      ],
    },
    {
      train_number: '22692',
      name: 'Karnataka Sampark Kranti Express',
      source: 'H.Nizamuddin (NZM)',
      destination: 'KSR Bengaluru (SBC)',
      departure_time: '19:50',
      arrival_time: '05:20',
      duration: '33h 30m',
      classes_available: '1A,2A,3A,SL',
      distance: 2366,
      stops: [
        { station: 'Bhopal Jn (BPL)', arrival: '04:30', departure: '04:40', distance: 694 },
        { station: 'Kacheguda (KCG)', arrival: '19:30', departure: '19:40', distance: 1532 },
        { station: 'Yelahanka Jn (YNK)', arrival: '04:20', departure: '04:22', distance: 2351 },
      ],
    },
    {
      train_number: '12051',
      name: 'Madgaon Jan Shatabdi Express',
      source: 'Mumbai CSMT (CSMT)',
      destination: 'Madgaon Jn (MAO)',
      departure_time: '05:10',
      arrival_time: '14:10',
      duration: '09h 00m',
      classes_available: 'CC,2S',
      distance: 580,
      stops: [
        { station: 'Thane (TNA)', arrival: '05:43', departure: '05:45', distance: 33 },
        { station: 'Ratnagiri (RN)', arrival: '09:40', departure: '09:45', distance: 335 },
        { station: 'Thivim (THVM)', arrival: '13:00', departure: '13:02', distance: 529 },
      ],
    },
    {
      train_number: '12004',
      name: 'Lucknow Swarna Shatabdi Express',
      source: 'New Delhi (NDLS)',
      destination: 'Lucknow Charbagh (LKO)',
      departure_time: '06:10',
      arrival_time: '12:40',
      duration: '06h 30m',
      classes_available: 'CC,EC',
      distance: 512,
      stops: [
        { station: 'Ghaziabad Jn (GZB)', arrival: '06:48', departure: '06:50', distance: 25 },
        { station: 'Aligarh Jn (ALJN)', arrival: '07:53', departure: '07:55', distance: 131 },
        { station: 'Kanpur Central (CNB)', arrival: '11:20', departure: '11:25', distance: 440 },
      ],
    },
    {
      train_number: '12955',
      name: 'Mumbai - Jaipur Superfast Express',
      source: 'Mumbai Central (MMCT)',
      destination: 'Jaipur Jn (JP)',
      departure_time: '19:05',
      arrival_time: '12:45',
      duration: '17h 40m',
      classes_available: '1A,2A,3A,SL',
      distance: 1159,
      stops: [
        { station: 'Surat (ST)', arrival: '22:30', departure: '22:35', distance: 263 },
        { station: 'Vadodara Jn (BRC)', arrival: '00:10', departure: '00:20', distance: 393 },
        { station: 'Kota Jn (KOTA)', arrival: '07:00', departure: '07:15', distance: 918 },
        { station: 'Sawai Madhopur (SWM)', arrival: '08:40', departure: '08:55', distance: 1026 },
      ],
    },
  ];

  function meTime(t) { return t; }

  const dates = getNext7Days();

  for (const t of trainsData) {
    const createdTrain = await prisma.train.create({
      data: {
        train_number: t.train_number,
        name: t.name,
        source: t.source,
        destination: t.destination,
        departure_time: t.departure_time,
        arrival_time: t.arrival_time,
        duration: t.duration,
        classes_available: t.classes_available,
      },
    });

    // Create Route
    await prisma.route.create({
      data: {
        train_id: createdTrain.id,
        distance: t.distance,
        stops: JSON.stringify(t.stops),
      },
    });

    // Create Seat Inventory for next 7 days for each class
    const classes = t.classes_available.split(',');
    for (const d of dates) {
      for (const cls of classes) {
        let totalSeats = 60;
        if (cls === '1A') totalSeats = 18;
        if (cls === '2A') totalSeats = 48;
        if (cls === '3A') totalSeats = 64;
        if (cls === 'SL') totalSeats = 72;
        if (cls === 'CC') totalSeats = 78;
        if (cls === 'EC') totalSeats = 56;
        if (cls === '2S') totalSeats = 100;

        const isBusyDay = d === dates[0] || d === dates[1];
        let availableSeats = isBusyDay ? Math.floor(Math.random() * 8) + 2 : Math.floor(Math.random() * (totalSeats - 15)) + 15;
        let racCount = 0;
        let waitlistCount = 0;

        if (availableSeats <= 2 && Math.random() > 0.5) {
          availableSeats = 0;
          racCount = Math.floor(Math.random() * 8);
          if (racCount === 0) {
            waitlistCount = Math.floor(Math.random() * 12) + 1;
          }
        }

        await prisma.seatInventory.create({
          data: {
            train_id: createdTrain.id,
            class: cls.trim(),
            date: d,
            total_seats: totalSeats,
            available_seats: availableSeats,
            rac_count: racCount,
            waitlist_count: waitlistCount,
          },
        });
      }
    }
  }

  console.log(`✅ ${trainsData.length} trains seeded with standardized station names & 7-day seat inventory!`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
