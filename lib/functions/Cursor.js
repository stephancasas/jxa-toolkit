/**
 * Interactive cursor support via the JXA Objective-C bridge.
 * Adapted from this blog post: https://blog.csdn.net/weixin_43090804/article/details/113683511
 */
const Cursor = () => {
  ObjC.import('Cocoa');
  ObjC.import('stdlib');
  ObjC.import('CoreGraphics');

  const EVENTS = {
    button: {
      left: {
        drag: $.kCGEventLeftMouseDragged,
        down: $.kCGEventLeftMouseDown,
        up: $.kCGEventLeftMouseUp,
      },
      right: {
        down: $.kCGEventRightMouseDown,
        up: $.kCGEventRightMouseUp,
      },
    },
    move: $.kCGEventMouseMoved,
    scroll: $.KCGEventScrollWheel,
  };

  const EventFactory = (type, pos) => {
    var event = $.CGEventCreateMouseEvent($(), type, pos, $.kCGMouseButtonLeft);
    $.CGEventPost($.kCGHIDEventTap, event);
    delay(0.01);
  };

  return {
    get position() {
      const screenH = $.NSScreen.mainScreen.frame.size.height;
      const pos = $.NSEvent.mouseLocation;

      return [
        parseInt(pos.x),
        // coordinates need the screen height minus the coordinates obtained
        screenH - Math.trunc(pos.y),
      ];
    },
    get x() {
      return this.position[0];
    },
    get y() {
      return this.position[1];
    },
    leftButton: {
      down([x = this.x, y = this.y]) {
        EventFactory(EVENTS.button.left.down, { x, y });
      },
      up([x = this.x, y = this.y]) {
        EventFactory(EVENTS.button.left.up, { x, y });
      },
      click([x = this.x, y = this.y]) {
        this.leftButton.down([x, y]);
        this.leftButton.up([x, y]);
      },
    },
    rightButton: {
      down([x = this.x, y = this.y]) {
        EventFactory(EVENTS.button.right.down, { x, y });
      },
      up([x = this.x, y = this.y]) {
        EventFactory(EVENTS.button.right.up, { x, y });
      },
      click([x = this.x, y = this.y]) {
        this.rightButton.down([x, y]);
        this.rightButton.up([x, y]);
      },
    },
    drag([x, y], from = [this.x, this.y]) {
      this.leftButton.down(from);
      EventFactory(EVENTS.button.left.drag, { x, y });
      delay(0.5);
      this.leftButton.up([x, y]);
    },
    move([x, y]) {
      EventFactory(EVENTS.move, { x, y });
    },
  };
};
