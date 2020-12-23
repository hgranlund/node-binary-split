import { Readable, ReadableOptions, Writable } from 'stream';

export const devNullStream = (): Writable =>
  new Writable({
    write(chunk, encoding, done) {
      setImmediate(done);
    },
  });

export const intoStream = (obj: any, options?: ReadableOptions): Readable => {
  const values = Array.isArray(obj) ? Array.from(obj) : [obj];
  const stream = new Readable({
    ...options,
    read() {
      if (values.length > 10) {
        Array(10).map(() => this.push(values.shift()));
      } else if (values.length) {
        this.push(values.shift());
      } else {
        setImmediate(() => this.push(null));
      }
    },
  });
  return stream;
};

export const chunkCollector = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [] as string[];
    stream
      .on('data', (data) => {
        chunks.push(data.toString());
      })
      .on('end', () => {
        resolve(chunks);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};
