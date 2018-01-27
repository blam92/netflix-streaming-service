let server = require('./app');
let port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server running at ${port}`);
});