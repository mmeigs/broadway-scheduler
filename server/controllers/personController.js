const db = require('../models/eventModels');

const personController = {};

personController.addPerson = (req, res, next) => {
  const { name, role, grouping } = req.body;
  const queryStr = `INSERT INTO People (person_id, name, role, grouping) VALUES (((SELECT max(person_id) FROM People) + 1), '${name}', '${role}', '${grouping}');`;

  db.query(queryStr, (err, result) => {
    if (err) return next(err);
    return next();
  })
}

personController.getNewEvents = (req, res, next) => {
  console.log('getNewEvents !');
  // console.log('Here is the req body : ', req.body);
  const week = Number(req.body[0].week_id);
  // console.log('Here is the req body : ', req.body);
  const info = req.body[0].info;

  const queryStr = `SELECT Event.*, People.*, Day.day_of_week, Week.week_date
  FROM Event
  INNER JOIN Event_ppl ON Event.event_id = Event_ppl.event_id
  INNER JOIN People ON People.person_id = Event_ppl.person_id
  LEFT OUTER JOIN Day ON Day.day_id = Event.day_id
  LEFT OUTER JOIN Week ON Week.week_id = Event.week_id
  WHERE Event.week_id = ${week} AND Event.info = '${info}';`;

  const newResults = [];

  for (let i = 0; i < req.body.length; i++) {
    const e = req.body[i];
    const values = [e.info];
    db.query(queryStr, (err, result) => {
      if (err) {
        console.log('query error: ', err);
        return next(err);
      }
      newResults.push(result.rows);
      console.log('query result: ', result.rows);
      res.locals.newEvents = newResults;
    return next();
    })
  }

  // setTimeout( function(){
  //   res.locals.newEvents = newResults;
  //   return next();
  // }, 3000);
  
}

module.exports = personController;