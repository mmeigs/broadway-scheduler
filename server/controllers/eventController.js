const db = require('../models/eventModels.js');

const eventController = {};

eventController.getEvents = (req, res, next) => {
  // console.log('IN GET EVENTS!!!')
  // const grabThem = 'SELECT * FROM Event;';
  const grabItAll = `
        SELECT Event.*, People.*, Day.day_of_week, Week.week_date
        FROM Event
        INNER JOIN Event_ppl ON Event.event_id = Event_ppl.event_id
        INNER JOIN People ON People.person_id = Event_ppl.person_id
        INNER JOIN Day ON Day.day_id = Event.day_id
        INNER JOIN Week ON Week.week_id = Day.week_id
        WHERE Week.week_id = $1;`;
  const values = [1];
  db.query(grabItAll, values, (err, events) => {
    if (err) return next({ log: 'getEvents', message: err });

    const cache = {};
    
    for (let i = 0; i < events.rows.length; i++) {
      const event = events.rows[i];
      if (cache[event.event_id]) {
        const savedName = cache[event.event_id].name;
        const savedGrouping = cache[event.event_id].grouping;

        cache[event.event_id].name = Array.isArray(savedName) ? [...savedName, event.name] : [savedName, event.name];
        cache[event.event_id].grouping = Array.isArray(savedGrouping) ? [...savedGrouping, event.grouping] : [savedGrouping, event.grouping];
      } else {
        cache[event.event_id] = event;
      }
    }

    // console.log(Object.values(cache))

    res.locals.events = Object.values(cache);
    return next();
  })
}

module.exports = eventController;