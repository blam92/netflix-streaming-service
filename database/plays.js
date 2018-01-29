let createNewPlay = (client, contentId, userId) => {
  const query = `INSERT INTO plays (id, contentId, uId, startDate, endDate, secondsWatched)
    VALUES (uuid(), ?, ?, toTimestamp(now()), null, 0)`;
  return client.execute(query, [contentId, userId], {prepare: true})
  .then((results) => {
    return {ok: true}
  })
  .catch((err) => err);
}

module.exports = {
  createNewPlay: createNewPlay
}