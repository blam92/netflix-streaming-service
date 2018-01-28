-- USE hello;

CREATE TYPE IF NOT EXISTS chunk (
  streamingData TEXT,
  start INT,
  end INT,
  nextChunk INT
);

CREATE TABLE IF NOT EXISTS manifest (
  contentId INT PRIMARY KEY,
  chunks LIST<frozen <chunk>>
);

CREATE TABLE IF NOT EXISTS chunks (
  id INT PRIMARY KEY,
  chunk frozen <chunk>
);

CREATE TABLE IF NOT EXISTS PLAYS (
  id UUID PRIMARY KEY,
  uid INT,
  contentId INT,
  startDate TIMESTAMP,
  endDate TIMESTAMP,
  secondsWatched INT
);


