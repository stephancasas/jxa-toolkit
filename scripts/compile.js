const { exec } = require('child_process');
const fs = require('fs');
const { resolve: path } = require('path');

const pathTo = {
  root: () => path(__dirname, '..'),
  dist: () => path(pathTo.root(), 'dist'),
  lib: () => path(pathTo.root(), 'lib'),
  functions: () => path(pathTo.lib(), 'functions'),
  output: () => path(pathTo.dist(), 'app.jxa'),
};

const read = (path) => fs.readFileSync(path, { encoding: 'utf-8' });

// clean dist
fs.rmSync(pathTo.dist(), { recursive: true, force: true });
fs.mkdirSync(pathTo.dist(), { recursive: true });

let src, output, head, tail;

output = read(path(pathTo.lib(), 'wrapper.js'));

// apply functions
src = fs
  .readdirSync(pathTo.functions())
  .map((fn) => read(`${pathTo.functions()}/${fn}`))
  .join('\n');
[head, tail] = output.split('/* {{ FUNCTIONS }} */');
output = `${head}${src}${tail}`;

// apply src
src = read(path(pathTo.root(), 'src/app.js'));
[head, tail] = output.split('/* {{ SCRIPT }} */');
output = `${head}${src}${tail}`;

// write and permit
fs.writeFileSync(pathTo.output(), output, {
  encoding: 'utf-8',
});
exec(`chmod +x ${pathTo.output()}`);
