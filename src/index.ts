import { Transform, TransformCallback, TransformOptions } from 'stream';

export class BinarySplit extends Transform {
  splitOn: Buffer;
  buffered: Buffer;
  constructor(splitOn = '\n' as string | Buffer, opt?: TransformOptions) {
    super(opt);
    if (typeof splitOn === 'string') {
      this.splitOn = Buffer.from(splitOn);
    } else {
      this.splitOn = splitOn;
    }
  }

  _transform(chunk: Buffer, encoding: string, done: TransformCallback): void {
    this.addToBuffered(chunk);

    let splitAt = this.buffered.indexOf(this.splitOn);
    while (splitAt > -1) {
      this.push(this.buffered.subarray(0, splitAt));
      this.buffered = this.buffered.subarray(splitAt + this.splitOn.length)
      splitAt = this.buffered.indexOf(this.splitOn);
    }
    done();
  }

  private addToBuffered(chunk: Buffer) {
    if (this.buffered == null) {
      this.buffered = chunk;
    } else {
      this.buffered = Buffer.concat([this.buffered, chunk]);
    }
  }

  _flush(done: TransformCallback): void {
    if (this.buffered != null) {
      this.push(this.buffered);
    }
    done();
  }
}

export default (splitOn?: string | Buffer) => {
  return new BinarySplit(splitOn);
};
