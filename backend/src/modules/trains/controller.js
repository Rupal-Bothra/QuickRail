import prisma from '../../utils/prisma.js';

const CLASS_MULTIPLIERS = {
  '1A': 2.8,
  '2A': 1.9,
  '3A': 1.3,
  'SL': 0.55,
  'CC': 0.95,
  'EC': 2.1,
  '2S': 0.35,
};

function normalizeStr(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

function matchesStation(fullStationName, query) {
  if (!query || !query.trim()) return true;
  const sNorm = normalizeStr(fullStationName);
  const qNorm = normalizeStr(query);
  if (!qNorm) return true;

  // Direct substring match
  if (sNorm.includes(qNorm)) return true;

  // Words match check
  const qWords = qNorm.split(' ');
  return qWords.every((word) => sNorm.includes(word));
}

export async function searchTrains(req, res, next) {
  try {
    const { source, destination, date } = req.query;

    const allTrains = await prisma.train.findMany({
      include: {
        routes: true,
        seat_inventories: date ? { where: { date: date } } : true,
      },
    });

    const matchingTrains = [];

    for (const t of allTrains) {
      const stops = t.routes[0]?.stops ? JSON.parse(t.routes[0].stops) : [];
      const totalDist = t.routes[0]?.distance || 500;

      // Full station path for this train
      const fullPath = [
        { station: t.source, departure: t.departure_time, distance: 0 },
        ...stops,
        { station: t.destination, arrival: t.arrival_time, distance: totalDist },
      ];

      // Find indices matching source and destination queries
      let sIndex = -1;
      let dIndex = -1;

      if (!source) {
        sIndex = 0;
      } else {
        sIndex = fullPath.findIndex((st) => matchesStation(st.station, source));
      }

      if (!destination) {
        dIndex = fullPath.length - 1;
      } else {
        // Find destination match occurring AFTER source
        dIndex = fullPath.findIndex((st, idx) => idx > (sIndex >= 0 ? sIndex : -1) && matchesStation(st.station, destination));
      }

      // Check if valid direction route match
      if (sIndex !== -1 && dIndex !== -1 && sIndex < dIndex) {
        const boardStation = fullPath[sIndex];
        const alightStation = fullPath[dIndex];
        const segmentDist = Math.max(100, (alightStation.distance || totalDist) - (boardStation.distance || 0));

        const classes = t.classes_available.split(',');
        const availability = classes.map((cls) => {
          const clsTrimmed = cls.trim();
          const inv = t.seat_inventories.find((i) => i.class === clsTrimmed && (!date || i.date === date));
          const rate = CLASS_MULTIPLIERS[clsTrimmed] || 1.0;
          const fare = Math.round(segmentDist * rate);

          let statusText = 'AVAILABLE';
          let countText = 'AVAILABLE';
          let statusBadge = 'available';

          if (inv) {
            if (inv.available_seats > 0) {
              statusText = `AVAILABLE - ${inv.available_seats}`;
              countText = `${inv.available_seats} Seats`;
              statusBadge = 'available';
            } else if (inv.rac_count > 0) {
              statusText = `RAC - ${inv.rac_count}`;
              countText = `RAC ${inv.rac_count}`;
              statusBadge = 'rac';
            } else {
              statusText = `WL - ${inv.waitlist_count || 1}`;
              countText = `WL ${inv.waitlist_count || 1}`;
              statusBadge = 'waitlist';
            }
          }

          return {
            class: clsTrimmed,
            fare,
            available_seats: inv ? inv.available_seats : 30,
            rac_count: inv ? inv.rac_count : 0,
            waitlist_count: inv ? inv.waitlist_count : 0,
            statusText,
            countText,
            statusBadge,
          };
        });

        matchingTrains.push({
          id: t.id,
          train_number: t.train_number,
          name: t.name,
          source: boardStation.station,
          destination: alightStation.station,
          departure_time: boardStation.departure || boardStation.arrival || t.departure_time,
          arrival_time: alightStation.arrival || alightStation.departure || t.arrival_time,
          duration: t.duration,
          classes_available: t.classes_available,
          distance: segmentDist,
          stops,
          availability,
        });
      }
    }

    return res.status(200).json({
      success: true,
      count: matchingTrains.length,
      data: matchingTrains,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTrainById(req, res, next) {
  try {
    const { id } = req.params;
    const train = await prisma.train.findUnique({
      where: { id: parseInt(id) },
      include: {
        routes: true,
        seat_inventories: true,
      },
    });

    if (!train) {
      return res.status(404).json({ success: false, message: 'Train not found' });
    }

    const stops = train.routes[0]?.stops ? JSON.parse(train.routes[0].stops) : [];

    return res.status(200).json({
      success: true,
      data: {
        ...train,
        stops,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getStations(req, res, next) {
  try {
    const trains = await prisma.train.findMany({
      include: { routes: true },
    });

    const stationSet = new Set();
    trains.forEach((t) => {
      if (t.source) stationSet.add(t.source);
      if (t.destination) stationSet.add(t.destination);

      if (t.routes && t.routes[0]?.stops) {
        try {
          const stops = JSON.parse(t.routes[0].stops);
          stops.forEach((st) => {
            if (st.station) stationSet.add(st.station);
          });
        } catch (e) {
          // ignore parse err
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: Array.from(stationSet).sort(),
    });
  } catch (error) {
    next(error);
  }
}
