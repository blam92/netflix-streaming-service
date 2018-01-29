let getManifest = (client, contentId) => {
  const query = 'SELECT * FROM manifest WHERE contentId = ?';
  return client.execute(query, [contentId], {prepare : true})
  .then(result => result.rows)
  .catch((err) => err);
}

let getFirstChunk = (client, contentId) => {
  return getManifest(client, contentId)
    .then((result) => {
      if(!result[0]) {
        return {err: 'content not found'}
      }
      return result[0].chunks[0];
    })
    .catch((err) => {
      return err;
    });
}
module.exports = {
  getFirstChunk: getFirstChunk
}