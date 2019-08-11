const { Readable, Writable } = require('stream');

const devNullStream = () =>
  Writable({
    write(chunk, encoding, done) {
      setImmediate(done);
    },
  });

const intoStream = (obj, options) => {
  const values = Array.isArray(obj) ? Array.from(obj) : [obj];
  const stream = new Readable({
    ...options,
    read() {
      if (values.length > 10) {
        Array(10)
          .fill()
          .map(() => this.push(values.shift()));
      } else if (values.length) {
        this.push(values.shift());
      } else {
        setImmediate(() => this.push(null));
      }
    },
  });
  return stream;
};

const chunkCollector = stream => {
  return new Promise((resolve, reject) => {
    let chunks = [];
    stream
      .on('readable', () => {
        let data;
        while ((data = stream.read())) {
          chunks.push(data.toString());
        }
      })
      .on('end', () => {
        resolve(chunks);
      })
      .on('error', error => {
        reject(error);
      });
  });
};

module.exports = { intoStream, chunkCollector, devNullStream };
