let fs = require('fs');

for(var i = 0; i < 1000; i++) {
  fs.appendFileSync('users_test.csv', `${i}\n`);
  fs.appendFileSync('chunks_test.csv', `${i}\n`);
  fs.appendFileSync('content_test.csv', `${i}\n`);
}