var express = require('express');
var router = express.Router();
var { isFloat, isInt, isString } = require('validator');
var { range: { distance: distRange, prize: prizeRange } } = require('../config');
var mysqlConnection = require('../utils/db');

function validateParams(req) {
  let { latitude, longitude, distance, prize, username } = req.query;
  let msg = "";
  let valid = true;
  if (latitude && !isFloat(latitude)) {
    valid = false;
    msg += "Latitude must be floating number.\n";
  }

  if (longitude && !isFloat(longitude)) {
    valid = false;
    msg += "Latitude must be floating number.\n";
  }

  if (distance && (!isInt(distance) || !(distRange.min <= distance && distance <= distRange.max))) {
    valid = false;
    msg += `Distance should be whole number and in ${distRange.min} to ${distRange.max} range.\n`;
  }

  if (prize && (!isInt(prize) || !(prizeRange.min <= prize && prize <= prizeRange.max))) {
    valid = false;
    msg += `Prize should be whole number and in ${prizeRange.min} to ${prizeRange.max} range \n`;
  }

  if (username && !isString(username)) {
    valid = false;
    msg += `Username should be string \n`;
  }

  return {
    valid, msg
  }
}

router.get('/find/treasure', function (req, res, next) {

  let { latitude, longitude, distance, prize } = req.query;

  if (!latitude || !longitude || !distance) {
    return res.status(400).json({
      error: "Latitude, Longitude and Distance are mandatory fields."
    })
  }

  let validation = validateParams(req);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.msg })
  }

  if (!prize) {
    mysqlConnection.query('SELECT `name`,\
  ACOS( SIN( RADIANS( `latitude` ) ) * SIN( RADIANS( :latitude ) ) + COS( RADIANS( `latitude` ) ) \
  * COS( RADIANS( :latitude )) * COS( RADIANS( `longitude` ) - RADIANS( :longitude )) ) * 6380 AS `distance` \
  FROM `treasures` \
  WHERE ACOS( SIN( RADIANS( `latitude` ) ) * SIN( RADIANS( :latitude ) ) + COS( RADIANS( `latitude` ) ) \
  * COS( RADIANS( :latitude )) * COS( RADIANS( `longitude` ) - RADIANS( :longitude )) ) * 6380 < :distance \
  ORDER BY `distance`', { latitude, longitude, distance }, function (error, results, fields) {
      if (error) throw error;
      res.status('200').json({ data: results })
    });
  } else {
    mysqlConnection.query('SELECT `t`.`name`,\
  ACOS( SIN( RADIANS( `t`.`latitude` ) ) * SIN( RADIANS( :latitude ) ) + COS( RADIANS( `t`.`latitude` ) ) \
  * COS( RADIANS( :latitude )) * COS( RADIANS( `t`.`longitude` ) - RADIANS( :longitude )) ) * 6380 AS `distance`, \
  `mv`.`amt` \
  FROM `treasures` as `t`\
  inner join money_values as mv on `t`.`id` = `mv`.`treasure_id` \
  WHERE ACOS( SIN( RADIANS( `t`.`latitude` ) ) * SIN( RADIANS( :latitude ) ) + COS( RADIANS( `t`.`latitude` ) ) \
  * COS( RADIANS( :latitude )) * COS( RADIANS( `t`.`longitude` ) - RADIANS( :longitude )) ) * 6380 < :distance \
  and `mv`.`amt` >= :prize \
  ORDER BY `distance`', { latitude, longitude, distance, prize }, function (error, results, fields) {
      if (error) throw error.message;
      res.status('200').json({ data: results })
    });
  }
});

router.get('/find/user/treasure', function (req, res, next) {
  let { username } = req.query;

  if (!username) {
    return res.status(400).json({
      error: "Username is mandatory field."
    });
  }
  mysqlConnection.query('SELECT t.name FROM `users` u\
  inner join user_treasure ut on u.id = ut.user_id\
  inner join treasures t on ut.treasure_id= t.id\
  where u.name = :username', { username }, function (error, results, fields) {
    if (error) throw error.message;
    res.status('200').json({ data: results })
  });
});


module.exports = router;
