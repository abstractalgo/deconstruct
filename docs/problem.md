### The problem:

Debugging in prod is hard and often not very pleasant. We rely on Fullstory, back-end logs and back-end events to try to reconstruct the user flow and states, that would then help us conclude what went wrong. The actual fixing of the issues is a challenge of its own, where we usually have to derive what went wrong on dry, then apply the path on dry, and then simply "hope for the best".

### The solution:

This ticket suggests building a sort of "replay tool" that would allow devs to retrieve a recoded user flow, let them play it back, while still being able to modify the app code and try playbacks again until the issue is resolved.

### How it works:

A developer retrieves a "playback file" and then "replays it" in local dev setup, allowing them to modify source code on the fly, and replay again with changes applied, making it possible to debug, fix and test.

A developer would scrape back-end logs, back-end events and perhaps get data and events from Fullstory and Segment, probably by using some script file that does all of that automatically and combines it into one "playback file". That files represent a full user's path and user's interactions.

If the data is not sufficient or available from a combination of mentioned sources, maybe we should build an additional "logger" that records all useful events that would be required in order for us to collect all data necessary to reconstruct a user flow.

Developer would start a local application in some sort of "debugging" mode that would expose ability to load a playback file (or it automatically loads the one from the same location always) and the developer would then be able to go step-by-step through the app, like the user did, triggering interactions (probably only clicks and keyboard events are important) and API calls (mocked request/response).

The advantage here is that this is just a playback, and the developer would be able to modify the app code in realtime, on the fly, to debug by stepping through code and putting breakpoints, and try the playback again with potential fixes in place. This would enable the best possible experience for the developer to understand what the problem was and how to best fix it, having at their disposal the full suite of debugging tools.

### Other use cases:

This is a tool that, for the most part, can be created independently from any specific app, and could be used on any app - enrollment clients, customer portal, login portal, advisors and admins portals, marketing site,...

### Front-end requirements:

Recording important interactions: keyboard events, mouse events (mostly just clicks),... API calls' request and responses.

The playback tool would have to be able to invoke interactions and mock (or intercept) API calls.

### Back-end requirements:

Some sort of storage for all these events, with additional metadata. For this purpose, Segment is the closest match for it, but would be utilized for (much) more types of events, or we would build our own "logger".
