let fs = require('fs');

for(var i = 0; i < 100000; i++) {
  fs.appendFileSync('users_test.csv', `${i}\n`);
  fs.appendFileSync('chunks_test.csv', `${i}\n`);
  // fs.appendFileSync('content_test.csv', `${i}\n`);
}

for(var j = 0; j < 1000; j++) {
  fs.appendFileSync('content_test.csv', `${j}\n`);
}