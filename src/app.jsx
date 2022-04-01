import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import ReferencesContainer from 'containers/references/index.jsx';
import configureStore from 'store/configureStore.js';
import bootstrap from 'styles/bootstrap.css';

// Prepare data
export const store = configureStore();


class LitScan extends HTMLElement {
  constructor() {
    super();

    // prepare DOM and shadow DOM
    // workaround found at https://github.com/facebook/react/issues/9242 to avoid re-renders
    const shadowRoot = this.attachShadow({mode: 'open'});
    const mountPoint = document.createElement('html');
    shadowRoot.appendChild(mountPoint);
    Object.defineProperty(mountPoint, "ownerDocument", { value: shadowRoot });
    shadowRoot.createElement = (...args) => document.createElement(...args);
    shadowRoot.createElementNS = (...args) => document.createElementNS(...args);
    shadowRoot.createTextNode = (...args) => document.createTextNode(...args);

    // parse arguments
    const search = JSON.parse(this.attributes.search ? this.attributes.search.nodeValue : null);
    const customStyle = JSON.parse(this.attributes.customStyle ? this.attributes.customStyle.nodeValue : null);
    const database = JSON.parse(this.attributes.database ? this.attributes.database.nodeValue : null);

    // render React
    ReactDOM.render([
      <style key={bootstrap} dangerouslySetInnerHTML={{__html: bootstrap}}/>,
      <body key='body'>
        <Provider key='provider' store={store}>
          <ReferencesContainer
              search={search}
              customStyle={customStyle}
              database={database}
          />
        </Provider>
      </body>
      ],
      mountPoint
    );
  }

  connectedCallback() {
  }

  disconnectedCallback() {
    let state = store.getState();
    if (state.statusTimeout) {
      clearTimeout(state.statusTimeout);
    }
  }
}

customElements.define('rnacentral-litscan', LitScan);
