var through = require('through2');

function BinarySplit(splitOn = '\n') {
  if (!(this instanceof BinarySplit)) return new BinarySplit(splitOn);
  const _splitOn = Buffer.from(splitOn || '\n');
  let buffered = [];
  const getBuffered = () => {
    if (buffered.length === 1) {
      return buffered.pop();
    } else {
      const buf = Buffer.concat(buffered);
      buffered = [];
      return buf;
    }
  };
  return through(write, flush);

  function write(chunk, enc, done) {
    let offset = 0;
    while (offset < chunk.length) {
      const splitAt = chunk.indexOf(_splitOn, offset);
      if (splitAt === -1) {
        buffered.push(chunk.slice(offset));
        offset = chunk.length;
      } else {
        buffered.push(chunk.slice(offset, splitAt));
        this.push(getBuffered());
        offset = splitAt + _splitOn.length;
      }
    }
    done();
  }

  function flush(done) {
    if (buffered.length) {
      this.push(getBuffered());
    }
    done();
  }
}

module.exports = BinarySplit;
