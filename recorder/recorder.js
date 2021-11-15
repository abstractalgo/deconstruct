;(() => {
  const KEY_EVENT_PROPS = [
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
    // "target",
  ]

  const MOUSE_EVENT_PROPS = [
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
    // "target",
  ]

  const EVENTS_PROPS = {
    // keyboard events
    keydown: KEY_EVENT_PROPS,
    keyup: KEY_EVENT_PROPS,

    // mouse events
    mousedown: MOUSE_EVENT_PROPS,
    mouseup: MOUSE_EVENT_PROPS,
    click: MOUSE_EVENT_PROPS,
    dblclick: MOUSE_EVENT_PROPS,
    mousemove: MOUSE_EVENT_PROPS,
    contextmenu: MOUSE_EVENT_PROPS,

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

  const ALLOWED_EVENTS = Object.keys(EVENTS_PROPS)

  // --- recorder --------------------------------------------------------------

  let eventsBuffer = []
  const pushToBuffer = (event, meta) => {
    eventsBuffer.push({
      type: event,
      meta: meta,
      browser: window.navigator.userAgent,
      timestamp: Date.now(),
    })
  }

  window.deconstruct_flush = () => {
    console.log(JSON.stringify(eventsBuffer, null, 4))
    eventsBuffer = []
  }

  window.replay = () => {
    eventsBuffer.forEach((event) => {
      if (["click", "mousedown", "mouseup", "mousemove"].includes(event.type)) {
        const ev = new MouseEvent(event.type, {
          ...event.meta,
        })
        const delay = event.timestamp - eventsBuffer[0].timestamp + 2000
        setTimeout(() => {
          console.log(event.type)
          dispatchEvent(ev)
        }, delay)
      }
      if (["keydown", "keyup"].includes(event.type)) {
        const ev = new KeyboardEvent(event.type, {
          ...event.meta,
        })
        const delay = event.timestamp - eventsBuffer[0].timestamp + 2000
        setTimeout(() => {
          console.log(event.type)
          dispatchEvent(ev)
        }, delay)
      }
    })
  }

  // --- addEventListener() wrapper

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
        EVENTS_PROPS[type].forEach(
          (detail) => (eventDetails[detail] = args[0][detail])
        )
        pushToBuffer(type, eventDetails)
        listener(...args)
      },
      options
    )
  }

  ALLOWED_EVENTS.forEach((event) => window.addEventListener(event, () => {}))

  // --- fetch() wrapper

  const _original_fetch = window.fetch

  window.fetch = (input, init) => {
    pushToBuffer("request", {
      input: input,
      init: init,
    })

    return _original_fetch(input, init).then(async (res) => {
      try {
        const responseCopy = res.clone()
        pushToBuffer("response", {
          data: await responseCopy.json(),
        })
      } catch (e) {
        console.log(e)
      }
      return res
    })
  }

  // --- XMLHttpRequest() wrapper

  // const _original_onreadystatechange =
  // XMLHttpRequest.prototype._onreadystatechange =
  //   XMLHttpRequest.prototype.onreadystatechange
  // XMLHttpRequest.prototype._original_onreadystatechange = _original_onreadystatechange
  // XMLHttpRequest.prototype.send = function (...args) {
  //   console.log(this, args)
  //   // console.log("KURAC")
  // }

  // const _original_xhr = window.XMLHttpRequest
  // window.XMLHttpRequest = function () {
  //   const xhr = new _original_xhr()
  //   xhr.onreadystatechange = () => {
  //     console.log("jebi")
  //   }
  //   return xhr
  // }

  // XMLHttpRequest.constructor = function () {
  //   console.log("new")
  // }
  // XMLHttpRequest.prototype.addEventListener = function () {
  //   console.log("aEL")
  // }
  // XMLHttpRequest.prototype.onreadystatechange = function (...args) {
  //   // console.log("oRSC")
  //   // console.log("---", this.readyState)
  //   // this._onreadystatechange(...args)
  //   // _original_onreadystatechange.call(this, ...args)
  // }
})()

console.log("recorder initalized.")
