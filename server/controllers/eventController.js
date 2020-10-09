const db = require('../models/eventModels.js');

const eventController = {};

// get All Events from database for current week //
eventController.getEvents = (req, res, next) => {
  console.log('Made it to getEvents')
  // const grabItAll = `
  //       SELECT Event.*, People.*, Day.day_of_week, Week.week_date
  //       FROM Event
  //       LEFT OUTER JOIN Event_ppl ON Event.event_id = Event_ppl.event_id
  //       LEFT OUTER JOIN People ON People.person_id = Event_ppl.person_id
  //       LEFT OUTER JOIN Day ON Day.day_id = Event.day_id
  //       LEFT OUTER JOIN Week ON Week.week_id = Event.week_id;`;
  
        // WHERE Event.week_id = $1;`;
  const grabItAll = `SELECT Event.*, People.*, Day.*, Week.week_date
  FROM Event
  LEFT OUTER JOIN Event_ppl ON Event.event_id = Event_ppl.event_id
  LEFT OUTER JOIN People ON People.person_id = Event_ppl.person_id
  FULL OUTER JOIN Day ON Day.day_id = Event.day_id
  LEFT OUTER JOIN Week ON Week.week_id = Event.week_id;`;
  // const values = [1];
  db.query(grabItAll, (err, events) => {
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
    // console.log('heres the result', res.locals.events)
    return next();
  })
}


// Add newly created events to database //
eventController.storeEvents = async (req, res, next) => {

  const { events, day, week } = req.body;

  for (let i = 0; i < events.length; i++) {
    const e = events[i];

    let addEventWithPpl = `BEGIN TRANSACTION;

    INSERT INTO Event (event_id, day_id, week_id, time_start, time_end, location, info)
    VALUES (((SELECT max(event_id) FROM Event) + ${i+1}), ${day}, ${week}, '${e.time_start}', '${e.time_end}', '${e.location}', '${e.info}');`;

    console.log('name length and array :', e.name.length, e.name)
    for (let j = 0; j < e.name.length; j++) {

      const name = e.name[j];

      addEventWithPpl += `INSERT INTO Event_ppl (event_id, person_id)
      VALUES ((SELECT max(event_id) FROM Event), (SELECT person_id FROM People WHERE name = '${name}'));`;
    }

    addEventWithPpl += `COMMIT;`;

    // console.log('query string!!!: ', addEventWithPpl)

    await db.query(addEventWithPpl, (err, result) => {
      if (err) {
        console.log(err);
        return next(err);}
      // console.log('got past error!!!!')
      
    });
  }
  return next();
}

// Delete event from database //
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