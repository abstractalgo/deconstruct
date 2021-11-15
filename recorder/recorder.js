;
(() => {
    const KEY_EVENT_PROPS = [
        "key",
        "keyCode",
        "which",
        "altKey",
        "metaKey",
        "shiftKey",
        "bubbles",
        "cancelBubble",
        "cancelable",
        "composed",
        "defaultPrevented",
        "repeat",
    ];
    const MOUSE_EVENT_PROPS = [
        "button",
        "which",
        "altKey",
        "metaKey",
        "shiftKey",
        "bubbles",
        "cancelBubble",
        "cancelable",
        "composed",
        "defaultPrevented",
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
        "movementX",
        "movementY",
    ];
    const EVENTS_PROPS = {
        keydown: KEY_EVENT_PROPS,
        keyup: KEY_EVENT_PROPS,
        mousedown: MOUSE_EVENT_PROPS,
        mouseup: MOUSE_EVENT_PROPS,
        click: MOUSE_EVENT_PROPS,
        dblclick: MOUSE_EVENT_PROPS,
        mousemove: MOUSE_EVENT_PROPS,
        contextmenu: MOUSE_EVENT_PROPS,
    };
    const ALLOWED_EVENTS = Object.keys(EVENTS_PROPS);
    let eventsBuffer = [];
    const pushToBuffer = (event, meta) => {
        eventsBuffer.push({
            type: event,
            meta: meta,
            browser: window.navigator.userAgent,
            timestamp: Date.now(),
        });
    };
    window.deconstruct_flush = () => {
        console.log(JSON.stringify(eventsBuffer, null, 4));
        eventsBuffer = [];
    };
    window.replay = () => {
        eventsBuffer.forEach((event) => {
            if (["click", "mousedown", "mouseup", "mousemove"].includes(event.type)) {
                const ev = new MouseEvent(event.type, {
                    ...event.meta,
                });
                const delay = event.timestamp - eventsBuffer[0].timestamp + 2000;
                setTimeout(() => {
                    console.log(event.type);
                    dispatchEvent(ev);
                }, delay);
            }
            if (["keydown", "keyup"].includes(event.type)) {
                const ev = new KeyboardEvent(event.type, {
                    ...event.meta,
                });
                const delay = event.timestamp - eventsBuffer[0].timestamp + 2000;
                setTimeout(() => {
                    console.log(event.type);
                    dispatchEvent(ev);
                }, delay);
            }
        });
    };
    const _original_aEL = window.addEventListener;
    window.addEventListener = (type, listener, options) => {
        if (!ALLOWED_EVENTS.includes(type)) {
            _original_aEL(type, listener, options);
            return;
        }
        _original_aEL(type, (...args) => {
            const eventDetails = {};
            EVENTS_PROPS[type].forEach((detail) => (eventDetails[detail] = args[0][detail]));
            pushToBuffer(type, eventDetails);
            listener(...args);
        }, options);
    };
    ALLOWED_EVENTS.forEach((event) => window.addEventListener(event, () => { }));
    const _original_fetch = window.fetch;
    window.fetch = (input, init) => {
        pushToBuffer("request", {
            input: input,
            init: init,
        });
        return _original_fetch(input, init).then(async (res) => {
            try {
                const responseCopy = res.clone();
                pushToBuffer("response", {
                    data: await responseCopy.json(),
                });
            }
            catch (e) {
                console.log(e);
            }
            return res;
        });
    };
})();
console.log("recorder initalized.");
