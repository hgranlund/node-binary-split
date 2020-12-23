import Benchmark from 'benchmark';
// import binarySplit from 'binary-split';
import { createReadStream } from 'fs';
// import split from 'split';
// import split2 from 'split2';
import nodeBinarySplit from '../src/index';
import { devNullStream } from '../tests/testUtils';

const testBuffer = () => createReadStream('bench/loremIpsum.txt');

const suite = new Benchmark.Suite();

suite
  .add(
    'node-binary-split',
    (deferred) => {
      const stream = testBuffer()
        .pipe(nodeBinarySplit('\n'))
        .on('end', () => deferred.resolve())
        .on('error', () => deferred.resolve());
      stream.pipe(devNullStream());
    },
    { defer: true }
  )
  // .add(
  //   'binary-split',
  //   (deferred) => {
  //     const stream = testBuffer()
  //       .pipe(binarySplit('\n'))
  //       .on('end', () => deferred.resolve())
  //       .on('error', () => deferred.resolve());
  //     stream.pipe(devNullStream());
  //   },
  //   { defer: true }
  // )
  // .add(
  //   'split',
  //   (deferred) => {
  //     const stream = testBuffer()
  //       .pipe(split('\n'))
  //       .on('end', () => deferred.resolve())
  //       .on('error', () => deferred.resolve());
  //     stream.pipe(devNullStream());
  //   },
  //   { defer: true }
  // )
  // .add(
  //   'split2',
  //   (deferred) => {
  //     const stream = testBuffer()
  //       .pipe(split2())
  //       .on('end', () => deferred.resolve())
  //       .on('error', () => deferred.resolve());
  //     stream.pipe(devNullStream());
  //   },
  //   { defer: true }
  // )
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', (event) => {
    console.log(
      'Fastest is ' + event.currentTarget.filter('fastest').map('name')
    );
  })
  .run();
