let fs = require('fs');
const cassandra = require('cassandra-driver');
let NUMBER_OF_PLAYS = parseInt(process.argv[2]) || 10;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

for(var i = 0; i < NUMBER_OF_PLAYS; i++) {
  let id = cassandra.types.Uuid.random();
  let startDate = cassandra.types.generateTimestamp();
  let endDate = '';
  let secondsWatched = 0;
  let contentId = getRandomInt(0, 500000);
  let uid= getRandomInt(0, 500000);
  fs.appendFileSync('plays.txt', `${id}|${contentId}|${endDate}|${secondsWatched}|${startDate}|${uid}\n`);
}