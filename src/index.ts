import { Transform, TransformCallback, TransformOptions } from 'stream';

export class BinarySplit extends Transform {
  splitOn: Buffer;
  buffered = [] as Buffer[];
  pending = [] as Buffer[];
  constructor (splitOn = '\n' as string | Buffer, opt?: TransformOptions) {
    super(opt);
    if (typeof splitOn === 'string') {
      this.splitOn = Buffer.from(splitOn);
    } else {
      this.splitOn = splitOn;
    }
  }

  getBuffered (): Buffer {
    if (this.buffered.length === 1) {
      return this.buffered.pop();
    } else {
      const buf = Buffer.concat(this.buffered);
      this.buffered = [];
      return buf;
    }
  }
  getPending (): Buffer {
    return Buffer.concat(this.pending)
  }

  _transform (chunk: Buffer, encoding: string, done: TransformCallback): void {
    let offset = 0;
    let splitAt = 0;
    let found = 0;
    this.pending.push(chunk);
    while (offset < this.getPending().length) {
      splitAt = this.getPending().indexOf(this.splitOn, offset);
      if (splitAt === -1) {
        this.buffered.push(this.getPending().slice(offset));
        offset = this.getPending().length;
      } else {
        this.push(this.getPending().slice(offset, splitAt));
        this.buffered = []

        offset = splitAt + this.splitOn.length;
       found = offset 
      }
    }
    if (found > 0) { 
      const pending = this.getPending().slice(found)
      this.pending = [] 
      this.pending.push(pending)
    }
    done();
  }

  _flush (done: TransformCallback): void {
    if (this.buffered.length) {
      this.push(this.getBuffered());
    }
    done();
  }
}

export default (splitOn?: string | Buffer) => {
  return new BinarySplit(splitOn);
};
