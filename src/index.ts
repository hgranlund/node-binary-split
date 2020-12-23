import { Transform, TransformCallback, TransformOptions } from 'stream';

export class BinarySplit extends Transform {
  splitOn: Buffer;
  buffered = [] as Buffer[];
  constructor(splitOn = '\n' as string | Buffer, opt?: TransformOptions) {
    super(opt);
    if (typeof splitOn === 'string') {
      this.splitOn = Buffer.from(splitOn);
    } else {
      this.splitOn = splitOn;
    }
  }

  getBuffered(): Buffer {
    if (this.buffered.length === 1) {
      return this.buffered.pop();
    } else {
      const buf = Buffer.concat(this.buffered);
      this.buffered = [];
      return buf;
    }
  }

  _transform(chunk: Buffer, encoding: string, done: TransformCallback): void {
    let offset = 0;
    while (offset < chunk.length) {
      const splitAt = chunk.indexOf(this.splitOn, offset);
      if (splitAt === -1) {
        this.buffered.push(chunk.slice(offset));
        offset = chunk.length;
      } else {
        this.buffered.push(chunk.slice(offset, splitAt));
        this.push(this.getBuffered());
        offset = splitAt + this.splitOn.length;
      }
    }
    done();
  }

  _flush(done: TransformCallback): void {
    if (this.buffered.length) {
      this.push(this.getBuffered());
    }
    done();
  }
}

export default (splitOn?: string | Buffer) => {
  return new BinarySplit(splitOn);
};
