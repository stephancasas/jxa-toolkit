/**
 * File reading, writing, and deleting.
 */
const File = {
  read: (path) => exec('cat', Path.resolve(path)),
  write: (path, data) => {
    data = data.replace(/\\/g, '\\\\$&').replace(/"/g, '\\$&');
    return exec('printf', `"${data}"`, '>', Path.resolve(path));
  },
  delete: (path) => exec('rm', '-rf', path),
  exists: (path) =>
    typeof exec('test', '-f', `"${Path.resolve(path)}"`) === 'string',
};
