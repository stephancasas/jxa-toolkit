/**
 * Interactive cursor support via the JXA Objective-C bridge.
 */
const Cursor = {
  restoreTo: { x: 0, y: 0 },
  getPosition: (actual = false) => {
    let { x, y } = $.NSEvent.mouseLocation;
    const screenH = $.NSScreen.mainScreen.frame.size.height;
    y = !actual ? screenH - y : y;

    return { x, y };
  },
  setRestore: () => (Cursor.restoreTo = Cursor.getPosition()),
  restore: () => {
    const { x, y } = Cursor.restoreTo;
    Cursor.setPosition(x, y, { x: 0, y: 0 });
  },
  setPosition: (x, y, offset = { x: 8, y: 8 }) => {
    x += offset ? (offset.x ? offset.x : 0) : 0;
    y += offset ? (offset.y ? offset.y : 0) : 0;
    Cursor.btnEvent('left', 'up', x, y);
    delay(0.1);
    return Cursor;
  },
  click: (btn = 'left') => {
    const { x, y } = Cursor.getPosition();

    Cursor.btnEvent(btn, 'down', x, y);
    Cursor.btnEvent(btn, 'up', x, y);
  },
  btnEvent: (button = 'left', direction = 'down', x, y) => {
    const [btn, dir] = [button, direction].map(
      (x) => `${x[0].toUpperCase()}${[...x].slice(1).join('').toLowerCase()}`,
    );

    const evt = $.CGEventCreateMouseEvent(
      $(),
      $[`kCGEvent${btn}Mouse${dir}`],
      { x, y },
      $(),
    );

    $.CGEventPost($.kCGHIDEventTap, evt);
  },
};
