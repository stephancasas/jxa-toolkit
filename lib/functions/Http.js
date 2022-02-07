/**
 * Perform a synchronous/blocking fetch operation.
 * @param url The url to read.
 * @returns string
 * @requires ctx()
 * @requires exec()
 */
function fetchSync(url) {
  return ctx().exec(`curl "${url}"`);
}
