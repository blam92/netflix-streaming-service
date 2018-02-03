let increaseNextChunk = (requestParams, context, ee, next) => {
  context.vars.nextChunk++;
  return next();
}



module.exports = {
  increaseNextChunk: increaseNextChunk
}