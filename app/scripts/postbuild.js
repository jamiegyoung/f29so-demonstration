/* eslint-disable no-console */
const { rmSync } = require('fs');
const mv = require('mv');

rmSync('../server/public', { recursive: true, force: true });
rmSync('../server/private', { recursive: true, force: true });

mv('./build', '../server/public', { mkdirp: true }, (err) => {
  if (err) return console.error(err);
  console.log('Build moved to server');
  return mv(
    '../server/public/index.html',
    '../server/private/index.html',
    { mkdirp: true },
    (indexerr) => {
      if (err) return console.error(indexerr);
      return console.log('index.html moved to private');
    },
  );
});
