/**
 * Get the authoritative user application context.
 * @returns Context
 */
function ctx() {
  const app = Application.currentApplication();
  app.includeStandardAdditions = true;
  return app;
}

/**
 * Get an application process by its name.
 * @param {string} processName By name, the application process to resolve.
 * @returns ApplicationProcess
 */
function process(processName) {
  return Application('System Events').applicationProcesses.byName(processName);
}
