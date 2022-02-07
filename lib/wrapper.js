#!/usr/bin/env osascript -l JavaScript

function run(argv) {
  // cast cli arguments to persistent array
  argv = Array.isArray(argv) ? argv : [argv];

  // make objective-c bridge available
  ObjC.import('Cocoa');

  /* {{ FUNCTIONS }} */

  /* {{ SCRIPT }} */

  return run(argv);
}
