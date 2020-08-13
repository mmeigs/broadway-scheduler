const db = require('../models/eventModels.js');

const eventController = {};

eventController.getEvents = (req, res, next) => {
  const grabItAll = `
        SELECT Event.*, People.*, Day.day_of_week, Week.week_date
        FROM Event
        INNER JOIN Event_ppl ON Event.event_id = Event_ppl.event_id
        INNER JOIN People ON People.person_id = Event_ppl.person_id
        LEFT OUTER JOIN Day ON Day.day_id = Event.day_id
        LEFT OUTER JOIN Week ON Week.week_id = Event.week_id
        WHERE Event.week_id = $1;`;
  const values = [1];
  db.query(grabItAll, values, (err, events) => {
    if (err) return next({ log: 'getEvents', message: err });

    const cache = {};
    
    for (let i = 0; i < events.rows.length; i++) {
      const event = events.rows[i];
      if (cache[event.event_id]) {
        const savedName = cache[event.event_id].name;
        const savedGrouping = cache[event.event_id].grouping;

        cache[event.event_id].name = [...savedName, event.name];
        cache[event.event_id].grouping = [...savedGrouping, event.grouping];
      } else {
        cache[event.event_id] = event;
        cache[event.event_id].name = [event.name];
        cache[event.event_id].grouping = [event.grouping];
      }
    }

    res.locals.events = Object.values(cache);
    return next();
  })
}

eventController.storeEvents = (req, res, next) => {

  const { events, day } = req.body;

  for (let i = 0; i < events.length; i++) {
    const e = events[i];

    let addEventWithPpl = `BEGIN TRANSACTION;

    INSERT INTO Event (event_id, day_id, week_id, time_start, time_end, location, info)
    VALUES (((SELECT max(event_id) FROM Event) + 1), ${day}, 1, '${e.time_start}', '${e.time_end}', '${e.location}', '${e.info}');`;

    for (let j = 0; j < e.name.length; j++) {

      const name = e.name[j];

      addEventWithPpl += `INSERT INTO Event_ppl (event_id, person_id)
      VALUES ((SELECT max(event_id) FROM Event), (SELECT person_id FROM People WHERE name = '${name}'));`;
    }

    addEventWithPpl += `COMMIT;`;

    // console.log('query string!!!: ', addEventWithPpl)

    db.query(addEventWithPpl, (err, result) => {
      if (err) return next(err);
      // console.log('got past error!!!!')
      return next();
    });
  }
}

eventController.deleteEvent = (req, res, next) => {
  const { id } = req.body;

  const queryStr = `BEGIN TRANSACTION; 
  DELETE FROM Event WHERE event_id = ${id};
  DELETE FROM Event_ppl WHERE event_id = ${id};
  COMMIT;`;

  db.query(queryStr, (err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    console.log('Done with query')
    return next();
  })
}

module.exports = eventController;