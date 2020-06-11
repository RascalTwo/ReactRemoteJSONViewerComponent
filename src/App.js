import React, { useCallback, useMemo, useState } from 'react';

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('json', json);

function RemoteJSONViewer({ enableSyntaxHighlighter }) {
  const [state, setState] = useState({
    url: '',
    json: null,
    error: null,
  });

  const text = useMemo(() => (state.json !== null ? JSON.stringify(state.json, null, '  ') : null), [state.json]);

  const textNode = useMemo(
    () =>
      text &&
      (enableSyntaxHighlighter ? (
        <SyntaxHighlighter language="json" style={monokai}>
          {text}
        </SyntaxHighlighter>
      ) : (
        <textarea
          ref={ta => {
            if (!ta) return;
            ta.style.width = Math.min(window.innerWidth, ta.scrollWidth + 10) + 'px';
            ta.style.height = Math.min(window.innerHeight, ta.scrollHeight + 10) + 'px';
          }}
          value={text}
          disabled={true}
          style={{
            whiteSpace: 'pre',
            overflowWrap: 'normal',
          }}
        />
      )),
    [enableSyntaxHighlighter, text],
  );

  return (
    <form
      onSubmit={useCallback(
        e =>
          e.preventDefault() ||
          fetch(state.url)
            .then(response => response.json())
            .then(json => setState(state => ({ ...state, json, error: null })))
            .catch(error => setState(state => ({ ...state, error, json: null }))),
        [state.url],
      )}
    >
      <label>
        JSON URL
        <input
          type="text"
          value={state.url}
          onChange={useCallback(event => setState(state => ({ ...state, url: event.target.value })), [])}
        />
      </label>
      <button type="submit">View JSON</button>
      <br />
      {textNode}
      {state.error && <pre>{state.error.toString()}</pre>}
    </form>
  );
}

function App() {
  const [count, setCount] = useState(1);
  return (
    <React.Fragment>
      <div>
        <button onClick={useCallback(() => setCount(count => Math.max(count - 1, 0)), [])}>-</button>
        <button onClick={useCallback(() => setCount(count => count + 1), [])}>+</button>
      </div>
      <div>
        {Array(count)
          .fill(null)
          .map((_, i) => (
            <RemoteJSONViewer key={i} enableSyntaxHighlighter={i % 2} />
          ))}
      </div>
    </React.Fragment>
  );
}

export default App;
