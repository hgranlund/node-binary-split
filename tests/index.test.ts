import { createReadStream, readFileSync } from 'fs';
import 'jest';
import { Readable, Transform } from 'stream';
import { pipeline } from 'stream/promises';
import split, { BinarySplit } from '../src/index';
import { chunkCollector, intoStream } from './testUtils';

describe('BinarySplit', () => {
  describe('When a delimiter is provided', () => {
    it('should split the stream into chunks based on a newline delimiter', async () => {
      const chuncks = await chunkCollector(
        intoStream('aaa\nbbb').pipe(split('\n'))
      );
      expect(chuncks).toEqual(['aaa', 'bbb']);
    });
    it('should split the stream into chunks based on a longer string delimiter', async () => {
      const chuncks = await chunkCollector(
        intoStream('aaaADelimiterbbb').pipe(split('ADelimiter'))
      );
      expect(chuncks).toEqual(['aaa', 'bbb']);
    });
    it('should split the stream into chunks based on a newline buffer delimiter', async () => {
      const chuncks = await chunkCollector(
        intoStream('aaa\nbbb').pipe(split(Buffer.from('\n')))
      );
      expect(chuncks).toEqual(['aaa', 'bbb']);
    });
    it('issue#13: We should handle if delimiter is separated in two chunks', async () => {
      const chuncks = await chunkCollector(
        intoStream(['AAA--CUST', 'OM--BBB']).pipe(new BinarySplit('--CUSTOM--'))
      );
      expect(chuncks).toEqual(['AAA', 'BBB']);
    });
    it('issue#13:  We should handle if delimiter is separated in three chunks', async () => {
      const chuncks = await chunkCollector(
        intoStream(['AAA--CU','ST', 'OM--BBB']).pipe(new BinarySplit('--CUSTOM--'))
      );
      expect(chuncks).toEqual(['AAA', 'BBB']);
    });
    it('should handle delimiter on at 0', async () => {
      const chuncks = await chunkCollector(
        intoStream('\naaa').pipe(split('\n'))
      );
      expect(chuncks).toEqual(['aaa']);
    });
    it('should handle delimiter on at end', async () => {
      const chuncks = await chunkCollector(
        intoStream('aaa\n').pipe(split('\n'))
      );
      expect(chuncks).toEqual(['aaa']);
    });
    it('should use newline as default', async () => {
      const chuncks = await chunkCollector(
        intoStream('aaa\nbbb').pipe(split())
      );
      expect(chuncks).toEqual(['aaa', 'bbb']);
    });
    it('should handle new operator', async () => {
      const chuncks = await chunkCollector(
        intoStream('\naaa').pipe(new BinarySplit('\n'))
      );
      expect(chuncks).toEqual(['aaa']);
    });
    it('should handle multiple splits', async () => {
      const chunks = await chunkCollector(
        createReadStream('bench/loremIpsum.txt').pipe(new BinarySplit('\n'))
      );
      const expectedChunks = readFileSync('bench/loremIpsum.txt')
        .toString()
        .split('\n')
        .filter(Boolean);
      expect(chunks).toEqual(expectedChunks);
    });
    it('should find delimiter between chunks', async () => {
      const mockReadStream = () => {
        const readable = new Readable({
          read () { },
        });

        readable.push('aaa--cust')
        readable.push('om--bbb')

        readable.push(null)
        return readable;
      };

      const dataParser = new Transform({
        objectMode: true,
        transform (chunk, enc, callback) {
          return callback(null, chunk.toString());
        }
      })

      const ids = []
      const chuncks = await pipeline(
        mockReadStream(),
        new BinarySplit('--custom--'),
        dataParser,
        async function* (source) {
          for await (const data of source) {
            ids.push(data)
            yield data
          }
        }
      )
      expect(ids).toEqual(['aaa', 'bbb']);
    });

  });
});
