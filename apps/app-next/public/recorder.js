;(() => {
  const eventsBuffer = []

  const KEY_META = [
    // key
    "key",
    "keyCode",
    "which",
    // buttons
    "altKey",
    "metaKey",
    "shiftKey",
    // meta
    "bubbles",
    "cancelBubble",
    "cancelable",
    "composed",
    "defaultPrevented",
    "repeat",
    // target
    // ...
  ]

  const MOUSE_META = [
    // buttons
    "button",
    "which",
    "altKey",
    "metaKey",
    "shiftKey",
    // meta
    "bubbles",
    "cancelBubble",
    "cancelable",
    "composed",
    "defaultPrevented",
    // position
    "clientX",
    "clientY",
    "layerX",
    "layerY",
    "x",
    "y",
    "pageX",
    "pageY",
    "offsetX",
    "offsetY",
    // delta
    "movementX",
    "movementY",
    // target
    // ...
  ]

  const EVENTS_META = {
    // keyboard events
    keydown: KEY_META,
    keyup: KEY_META,

    // mouse events
    mousedown: MOUSE_META,
    mouseup: MOUSE_META,
    click: MOUSE_META,
    dblclick: MOUSE_META,
    // mousemove: MOUSE_META,
    contextmenu: MOUSE_META,

    // touch events
    // touchstart: [],
    // touchend: [],
    // touchmove: [],
    // touchcancel: [],

    // scroll events
    // scroll: [],
    // wheel: [],

    // clipboard events
    // cut: [],
    // copy: [],
    // paste: [],

    // window events
    // resize: [],
  }

  const ALLOWED_EVENTS = Object.keys(EVENTS_META)

  const _original_aEL = window.addEventListener

  window.addEventListener = (type, listener, options) => {
    if (!ALLOWED_EVENTS.includes(type)) {
      _original_aEL(type, listener, options)
      return
    }

    _original_aEL(
      type,
      (...args) => {
        const eventDetails = {}
        console.log(type)
        EVENTS_META[type].forEach(
          (detail) => (eventDetails[detail] = args[0][detail])
        )
        eventsBuffer.push({
          type: type,
          meta: eventDetails,
        })
        // console.log(JSON.stringify(eventsBuffer, null, 4))
        listener(...args)
      },
      options
    )
  }

  ALLOWED_EVENTS.forEach((event) => window.addEventListener(event, () => {}))
})()
