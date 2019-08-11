const { intoStream, chunkCollector } = require('./testUtils');
const split = require('../index');

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
    it('should split the stream into chunks based on a newlinr buffer delimiter', async () => {
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
    it('should handle multiple splits', async () => {
      const chuncks = await chunkCollector(
        intoStream('aaa\nbbb\nccc\nddd\neee').pipe(split('\n')),
      );
      expect(chuncks).toEqual(['aaa', 'bbb', 'ccc', 'ddd', 'eee']);
    });
  });
});
