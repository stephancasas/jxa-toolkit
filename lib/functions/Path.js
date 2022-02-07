/**
 * Resolution of POSIX paths, relative to the user shell.
 */
const Path = {
  resolve: (...args) => {
    const loc = args
      .map((arg, i) => {
        if (arg[0] === '/' && i !== 0) {
          arg = arg.replace('/', '');
        }
        if ([...arg].slice(-1) === '/') {
          arg = [...[...arg].reverse().join('').replace('/', '')]
            .reverse()
            .join('');
        }
        return arg;
      })
      .join('/');
    return loc[0] === '~' ? loc.replace('~', Path.User.HOME) : loc;
  },
  User: {
    get HOME() {
      return `/Users/${ctx().doShellScript('whoami')}`;
    },
    get DESKTOP() {
      return Path.resolve('~/Desktop');
    },
    get DOCUMENTS() {
      return Path.resolve('~/Documents');
    },
    get DOWNLOADS() {
      return Path.resolve('~/Downloads');
    },
    get LIBRARY() {
      return Path.resolve('~/Library');
    },
  },
  System: {
    get LIBRARY() {
      return Path.resolve('/Library');
    },
    get TMP() {
      return Path.resolve('/tmp');
    },
  },
};
