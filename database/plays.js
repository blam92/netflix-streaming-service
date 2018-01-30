let createNewPlay = (client, contentId, userId) => {
  const query = `INSERT INTO plays (id, contentId, uId, startDate, endDate, secondsWatched)
    VALUES (uuid(), ?, ?, toTimestamp(now()), null, 0)`;
  return client.execute(query, [contentId, userId], {prepare: true})
  .then((results) => {
    return {ok: true}
  })
  .catch((err) => err);
}

let updateMinutesWatchedOnPlay = (client, playId, secondsToUpdate) => {
  const query = `UPDATE plays SET secondsWatched = ? WHERE id = ?`;
  return client.execute(query, [secondsToUpdate, playId], {prepare: true})
  .then((results) => {
    return {ok: true}
  })
  .catch((err) => err);
}

let setEndDate = (client, playId) => {
  const query = `UPDATE plays SET enddate = toTimestamp(now()) WHERE id = ?`;
  return client.execute(query, [playId], {prepare: true})
  .then((results) => {
    return {ok: true}
  })
  .catch((err) => err);
}

module.exports = {
  createNewPlay: createNewPlay,
  updateMinutesWatchedOnPlay: updateMinutesWatchedOnPlay,
  setEndDate: setEndDate
}