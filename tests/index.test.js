const { intoStream, chunkCollector } = require('./testUtils');
const split = require('../src/index');
const { createReadStream, readFileSync } = require('fs');

describe('BinarySplit', () => {
  describe('When a delimiter is provided', () => {
    it('should split the stream into chunks based on a newline delimiter', async () => {
      const chuncks = await chunkCollector(
        intoStream('aaa\nbbb').pipe(split('\n')),
      );
      expect(chuncks).toEqual(['aaa', 'bbb']);
    });
    it('should split the stream into chunks based on a longer string delimiter', async () => {
      const chuncks = await chunkCollector(
        intoStream('aaaADelimiterbbb').pipe(split('ADelimiter')),
      );
      expect(chuncks).toEqual(['aaa', 'bbb']);
    });
    it('should split the stream into chunks based on a newline buffer delimiter', async () => {
      const chuncks = await chunkCollector(
        intoStream('aaa\nbbb').pipe(split(Buffer.from('\n'))),
      );
      expect(chuncks).toEqual(['aaa', 'bbb']);
    });
    it('should handle delimiter on at 0', async () => {
      const chuncks = await chunkCollector(
        intoStream('\naaa').pipe(split('\n')),
      );
      expect(chuncks).toEqual(['aaa']);
    });
    it('should handle delimiter on at end', async () => {
      const chuncks = await chunkCollector(
        intoStream('aaa\n').pipe(split('\n')),
      );
      expect(chuncks).toEqual(['aaa']);
    });
    it('should use newline as default', async () => {
      const chuncks = await chunkCollector(
        intoStream('aaa\nbbb').pipe(split()),
      );
      expect(chuncks).toEqual(['aaa', 'bbb']);
    });
    it('should handle new operator', async () => {
      const chuncks = await chunkCollector(
        intoStream('\naaa').pipe(new split('\n')),
      );
      expect(chuncks).toEqual(['aaa']);
    });
    it('should split the stream on a newline by default', async () => {
      const chuncks = await chunkCollector(
        intoStream('aaa\nbbb').pipe(split()),
      );
      expect(chuncks).toEqual(['aaa', 'bbb']);
    });
    it('should handle multiple splits', async () => {
      const chunks = await chunkCollector(
        createReadStream('bench/loremIpsum.txt').pipe(split('\n')),
      );
      const expectedChunks = readFileSync('bench/loremIpsum.txt')
        .toString()
        .split('\n')
        .filter(Boolean);
      expect(chunks).toEqual(expectedChunks);
    });
  });
});
