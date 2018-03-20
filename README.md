[![Build Status](https://travis-ci.org/PolymerLabs/blocking-elements.svg?branch=master)](https://travis-ci.org/PolymerLabs/blocking-elements)

# `blockingElements` stack API

Implementation of proposal <https://github.com/whatwg/html/issues/897>


## Install & use

Blocking Elements relies on `inert` attribute, so make sure to include its polyfill.

```bash
npm install --save wicg-inert
npm install --save blocking-elements
```

Import the `inert` polyfill **before** the `blocking-elements` one.

```html
<script src="./node_modules/wicg-inert/dist/inert.js"></script>
<script src="./node_modules/blocking-elements/dist/blocking-elements.js"></script>

<div id="container">
  <button onclick="makeBlocking(container)">make blocking</button> 
  <button onclick="undoBlocking(container)">undo blocking</button> 
</div>

<button>some button</button>

<script>
  function makeBlocking(element) {
    document.$blockingElements.push(element);
  }
  function undoBlocking(element) {
    document.$blockingElements.remove(element);
  }
</script>
```

`document.$blockingElements` manages a stack of elements that inert the interaction outside them.

- the stack can be updated with the methods `push(elem), remove(elem), pop(elem)`
- the top element (`document.$blockingElements.top`) and its subtree is the interactive part of the document
- `has(elem)` returns if the element is a blocking element

This polyfill will:

- search for the path of the element to block up to `document.body`
- set `inert` to all the siblings of each parent, skipping the parents and the element's distributed content (if any)

Use this polyfill together with the [wicg-inert](https://github.com/WICG/inert) polyfill to disable interactions on the rest of the document. See the [demo page](https://github.com/PolymerLabs/blocking-elements/blob/master/demo/index.html) as an example.

## Why not listening to events that trigger focus change?

Another approach could be to listen for events that trigger focus change (e.g. `focus, blur, keydown`) and prevent those if focus moves out of the blocking element.

Wrapping the focus requires to find all the focusable nodes within the top blocking element, eventually sort by tabindex, in order to find first and last focusable node.

This approach doesn't allow the focus to move outside the window (e.g. to the browser's url bar, dev console if opened, etc.), and is less robust when used with assistive technology (e.g. android talkback allows to move focus with swipe on screen, Apple Voiceover allows to move focus with special keyboard combinations).

## Performance

Performance is dependent on the `inert` polyfill performance. Chrome recently landed [the `inert` attribute implementation](https://codereview.chromium.org/2088453002/) behind a flag.

Let's compare the how long it takes to toggle the deepest `x-trap-focus` inside nested `x-b` of the demo page (<http://localhost:8080/components/blocking-elements/demo/ce.html?ce=v1>) ![results](https://cloud.githubusercontent.com/assets/6173664/17538133/914f365a-5e57-11e6-9b91-1c6b7eb22d57.png).

`blockingElements` with native inert is **~15x faster** than polyfilled inert 🎉 🎉 🎉

| with polyfilled inert (M58) | with native inert (M60) |
|----------|--------|
| ![polyfill-inert-1.png](assets/polyfill-inert-1.png) | ![native-inert-1.png](assets/native-inert-1.png) |
| ![polyfill-inert-2.png](assets/polyfill-inert-2.png) | ![native-inert-2.png](assets/native-inert-2.png) |
| ![polyfill-inert-3.png](assets/polyfill-inert-3.png) | ![native-inert-3.png](assets/native-inert-3.png) |
| ![polyfill-inert-4.png](assets/polyfill-inert-4.png) | ![native-inert-4.png](assets/native-inert-4.png) |


## Local development

Install the dependencies via `npm` and the [polymer CLI](https://github.com/Polymer/polymer-cli):
```bash
$ npm install -g polymer-cli
$ npm install
$ polymer install
```

Serve the resources with `polymer serve --npm -o`