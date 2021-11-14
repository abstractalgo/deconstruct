;(() => {
  const eventsBuffer = []

  const ALLOWED_EVENTS = [
    // keyboard events
    "keydown",
    "keyup",

    // mouse events
    "mousedown",
    "mouseup",
    "click",
    "dblclick",
    // "mousemove",
    "contextmenu",

    // touch events
    // "touchstart",
    // "touchend",
    // "touchmove",
    // "touchcancel",

    // scroll events
    // "scroll",
    // "wheel"

    // clipboard events
    // "cut",
    // "copy",
    // "paste",

    // window events
    // "resize",
  ]

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
    keydown: KEY_META,
    keyup: KEY_META,

    mousedown: MOUSE_META,
    mouseup: MOUSE_META,
    click: MOUSE_META,
    dblclick: MOUSE_META,
    mousemove: MOUSE_META,
    contextmenu: MOUSE_META,
  }

  const oldEL = window.addEventListener

  window.addEventListener = (type, listener, options) => {
    if (!ALLOWED_EVENTS.includes(type)) {
      oldEL(type, listener, options)
      return
    }

    oldEL(
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
        console.log(JSON.stringify(eventsBuffer, null, 4))
        listener(...args)
      },
      options
    )
  }

  ALLOWED_EVENTS.forEach((event) => window.addEventListener(event, () => {}))
})()
