/**
 * Directory creation and enumeration.
 */
const Dir = {
  make: (path) => exec('mkdir', `"${Path.resolve(path)}"`),
  read: (path) =>
    exec(
      'ls',
      '-1',
      Path.resolve(path),
      '|',
      'awk',
      '\'{ ORS="%FNAME%"; print; }\'',
    )
      .split('%FNAME%')
      .filter((fname) => fname.length),
};
