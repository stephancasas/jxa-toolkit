# jxa-toolkit

A boilerplate / utility wrapper for JXA (AppleScript JavaScript) scripts — providing common automation functions.

## Usage

jxa-toolkit is intended to aid in the creation of JXA scripts which will be run from the command line/shell. The entrypoint is the top-level `run()` function, which accepts a single argument, `argv` — rendered as the array of args which are passed via the shell.

Write your automation script's entry code inside of the `run()` function of `src/app.js`. You can declare additional functions or variables outside of this function signature, but such declarations will remain dormant unless by a called inside of `run().`

When ready, use `npm run test` to compile your script inside of the utility wrapper and execute the outcome (`dist/app.jxa`). The execution permission will be automatically applied by the compiler script.

> :memo: **NOTE**
>
> If you have not previously granted permissions to _System Events_ or _Visual Studio Code_, macOS may prompt you for additional permissions. You should grant/apply these permissions in _System Preferences_ when prompted.

# Functions Reference

## Globals

### `ctx()` | _Current Application_

**Description**
Get the current application context with standard additions included.

**Example**

```js
// request input from the user
const response = ctx().displayDialog('Do you want to continue?');
```

---

### `process(processName)` | _Application Process by Name_

**Description**
Get the application process (of _System Events_) by its name.

**Arguments**

| Argument      | Description                  |
| :------------ | :--------------------------- |
| `processName` | The process name to resolve. |

**Example**

```js
// get the position of a Finder window
const windowPos = process('Finder').windows.at(0).position();
```

---

### `exec(...cmd)` | _Execute Shell Command_

**Description**
Execute a shell function — including the current user's environment variables and shell config.

**Arguments**

| Argument | Description                                       |
| :------- | :------------------------------------------------ |
| `cmd`    | The command to execute, and any of its arguments. |

**Example**

```js
// execute a nodejs script named "script.js" from the user's Downloads directory
exec('node', Path.resolve(Path.User.DOWNLOADS, 'script.js'));
```

---

### `fetchSync(url)` | _HTTP GET Request_

**Description**
Perform a `curl` `GET` request against the given url.

**Arguments**

| Argument | Description               |
| :------- | :------------------------ |
| `url`    | The request's target url. |

**Example**

```js
// verify whether or not the system is presently connected to the internet by
//   making a request to Apple's captive validation service
const hasInternet = fetchSync('https://captive.apple.com/')
  .toLowerCase()
  .includes('success');
```

## Cursor

### `Cursor.getPosition(actual)` | _Current Cursor Position_

**Description**
Get the cursor's current coordinates.

**Arguments**

| Argument | Description                                                                                     |
| :------- | :---------------------------------------------------------------------------------------------- |
| `actual` | Get the cursor's actual position without consideration for display offset (very rare use case). |

**Example**

```js
// get the cursor's current position
const { x, y } = Cursor.getPosition();
```

---

### `Cursor.setPosition(x, y, offset)` | _Set Cursor Position_

**Description**
Set the cursor's position using (x, y) coordinates. A default offset of 8x8 is applied. This is done to ensure correct targeting of coordinates provided by querying UI elements directly, but can be overriden by passing `null` as the third argument.

**Arguments**

| Argument | Description                                                    |
| :------- | :------------------------------------------------------------- |
| `x`      | The cursor's target `X` position.                              |
| `y`      | The cursor's target `Y` position.                              |
| `offset` | The offset, as `{x,y}`, to apply to the final cursor position. |

**Example**

```js
// move the cursor to the exact position of the first Finder window
const [x, y] = process('Finder')
  .windows.at(0)
  .attributes.byName('AXPosition')
  .value();

Cursor.setPosition(x, y, null);
```

---

### `Cursor.click(button)` | _Click the Cursor_

**Description**
Click the cursor at its current position.

**Arguments**

| Argument | Description                                                                  |
| :------- | :--------------------------------------------------------------------------- |
| `button` | As `'left'` or `'right'`, the cursor button to click (defaults to `'left'`). |

**Example**

```js
// move the cursor to the exact position of the first Finder window and click
const [x, y] = process('Finder')
  .windows.at(0)
  .attributes.byName('AXPosition')
  .value();

Cursor.setPosition(x, y, null);
Cursor.click('left');
```

---

### `Cursor.setRestore()` / `Cursor.restore()` | _Store/Restore the Cursor Position_

**Description**
Store the current cursor position for restore later.

**Example**

```js
// move the cursor to the exact position of the first Finder window and click,
//   then return to the original position
const [x, y] = process('Finder')
  .windows.at(0)
  .attributes.byName('AXPosition')
  .value();

Cursor.setRestore();
Cursor.setPosition(x, y, null);
Cursor.click('left');
Cursor.restore();
```

## File

### `File.read(path)` | _Read File Content_

**Description**
Read the content of file by its path.

**Arguments**

| Argument | Description                        |
| :------- | :--------------------------------- |
| `path`   | The POSIX path to the target file. |

**Example**

```js
// read the contents of a file on the desktop
const data = File.read('~/Desktop/my_file.txt');
```

---

### `File.write(path, data)` | _Write File Content_

**Description**
Write data to a file at the given path.

**Arguments**

| Argument | Description                        |
| :------- | :--------------------------------- |
| `path`   | The POSIX path to the target file. |
| `data`   | As a string, the data to write.    |

**Example**

```js
// write content to a file on the desktop
const data = 'Stephan hates osascript.';
File.write('~/Desktop/my_file.txt', data);
```

---

### `File.delete(path)` | _Delete a File_

**Description**
Delete a file or directory by its path.

**Arguments**

| Argument | Description                                     |
| :------- | :---------------------------------------------- |
| `path`   | The POSIX path to the target file or directory. |

**Example**

```js
// delete a file named "my_file.txt" from the desktop
File.delete('~/Desktop/my_file.txt');

// delete a directory named "AppleScript" from the desktop
File.delete('~/Desktop/AppleScript');
```

---

### `File.exists(path)` | _Check File Existence_

**Description**
Determine whether or not a file exists at the given path.

**Arguments**

| Argument | Description                        |
| :------- | :--------------------------------- |
| `path`   | The POSIX path to the target file. |

**Example**

```js
// perform an operation dependingon whether or not a file named
//  "my_file.txt" exists on the desktop
if (File.exists('~/Desktop/my_file.txt')) {
  // ...
}
```

## Dir

### `Dir.read(path)` | _List a Directory's Content_

**Description**
Read the content of a directory by its path. An array is returned, with each filename as an element.

**Arguments**

| Argument | Description                             |
| :------- | :-------------------------------------- |
| `path`   | The POSIX path to the target directory. |

**Example**

```js
// get the name of every file on the desktop
const files = Dir.read('~/Desktop');
```

---

### `Dir.make(path)` | _Make a Directory_

**Description**
Make a directory at the given path.

**Arguments**

| Argument | Description                                      |
| :------- | :----------------------------------------------- |
| `path`   | The POSIX path to the target creation directory. |

**Example**

```js
// create a directory named "AppleScript" on the desktop
Dir.make('~/Desktop/AppleScript');
```

## Path

### `Path.resolve(...path)` | _Resolve an Absolute Path_

**Description**
Resolve the absolute location of a given path.

**Note**
This is automatically applied to any `File` or `Dir` operations.

**Arguments**

| Argument | Description                                                                         |
| :------- | :---------------------------------------------------------------------------------- |
| `path`   | A single POSIX path to resolve, or its constituents separated into individual args. |

**Example**

```js
// get the path to a directory named "AppleScript" in the
//   current user's pictures directory
const applescript = Path.resolve('~/Pictures', 'AppleScript');
//   → "/Users/johnnyappleseed/Pictures/AppleScript"
```

---

### `Path.User.{{...}}` | _Resolve an Absolute User Path_

**Description**
Resolve the absolute location of the current user's home, `Desktop`, `Documents`, `Downloads`, or `Library` directory.

**Variations**
`Path.User.HOME` / `Path.User.DESKTOP` / `Path.User.DOCUMENTS` / `Path.User.DOWNLOADS` / `Path.User.LIBRARY`

**Example**

```js
// get the path to a file named "script.txt" in the current
//   user's Downloads directory
const applescript = Path.resolve(Path.User.DOWNLOADS, 'script.txt');
//   → "/Users/johnnyappleseed/Downloads/script.txt"
```

---

### `Path.System.{{...}}` | _Resolve an Absolute System Path_

**Description**
Resolve the absolute location of the system's `Library` or `tmp` (temporary) directory.

**Variations**

`Path.System.LIBRARY` / `Path.System.TMP`

**Example**

```js
// get the path to a file named "script.txt" in the temporary directory
const applescript = Path.resolve(Path.System.TMP, 'script.txt');
//   → "/tmp/script.txt"
```

# License

MIT -- _"Hell, yeah! Free software!"_

# Contact

| :man_technologist: | **Stephan Casas**                                       |
| :----------------: | :------------------------------------------------------ |
|      :email:       | stephancasas[at]icloud[dot]com                          |
|       :bird:       | [@stephancasas](https://www.twitter.com/stephancasas)   |
|      :camera:      | [@stephancasas](https://www.instagram.com/stephancasas) |
