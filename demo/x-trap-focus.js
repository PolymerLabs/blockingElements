/**
 * @license
 * Copyright 2016 Google Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: block;
    border: 1px solid lightgray;
    padding: 5px;
    margin: 5px;
  }

  :host(.blocking) {
    outline: 9999px solid rgba(0, 0, 0, 0.5);
  }

  label {
    display: block;
    margin-bottom: 5px;
  }
</style>
<label>
  <input id="toggle" type="checkbox"> Make blocking element
</label>
<slot id="xtrapfocus"></slot>`;

class XTrapFocus extends HTMLElement {
  connectedCallback() {
    const clone = document.importNode(template.content, true);
    clone.querySelector('#toggle').addEventListener('change', this._toggleTrap.bind(this));
    this.attachShadow({
      mode: 'open'
    }).appendChild(clone);
  }

  _toggleTrap(evt) {
    this.classList[evt.target.checked ? 'add' : 'remove']('blocking');
    document.$blockingElements[evt.target.checked ? 'push' : 'remove'](this);
  }
}
customElements.define('x-trap-focus', XTrapFocus);