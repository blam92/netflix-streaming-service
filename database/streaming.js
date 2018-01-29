let getManifest = (client, contentId) => {
  const query = 'SELECT * FROM manifest WHERE contentId = ?';
  return client.execute(query, [contentId], {prepare : true})
  .then(result => result.rows)
  .catch((err) => err);
}

let contentCheck = (result) => {
  if(!result[0]) {
    return {err: 'content not found'}
  } else {
    return {ok: true}
  }
}

let getFirstChunk = (client, contentId) => {
  return getManifest(client, contentId)
    .then((result) => {
      let status = contentCheck(result);
      if(status.err) {
        return status;
      }
      return result[0].chunks[0];
    })
    .catch((err) => {
      return err;
    });
}

let getChunkById = (client, chunkId) => {
  const query = 'SELECT * FROM chunks WHERE id = ?'
  return client.execute(query, [chunkId], {prepare: true})
  .then(result => {
    let status = contentCheck(result.rows);
    if(status.err) {
      return status;
    }
    return result.rows[0];
  })
  .catch((err) => {
    return {err: err};
  });
}

module.exports = {
  getFirstChunk: getFirstChunk,
  getChunkById: getChunkById
}