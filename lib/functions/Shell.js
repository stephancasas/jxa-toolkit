/**
 * Execute a command in the shell, using the paths and environment variables
 * available to the current user's session.
 * @param cmd The command to execute.
 * @returns string | boolean
 * @requires ctx()
 */
function exec(...cmd) {
  const paths = ctx()
    .doShellScript(`cat /etc/paths`)
    .split('\r')
    .map((path) => `export PATH="${path}:$PATH"`)
    .join(';');

  try {
    return ctx().doShellScript(`${paths}; source ~/.zshrc; ${cmd.join(' ')}`);
  } catch (ex) {
    return false;
  }
}
