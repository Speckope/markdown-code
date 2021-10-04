import * as esbuild from 'esbuild-wasm';
import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const App = () => {
  const ref = useRef<esbuild.Service>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const startService = async () => {
    // To use this service object outside of this function we can
    // either create new piece of state to share it
    // Or we can crate a ref! We can use refe not only to html elements.
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onCLick = async () => {
    if (!ref.current) {
      return;
    }

    const result = await ref.current.build({
      // It says to esbuild to bundle index.js file
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      // We pass input into our plugin!
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        // This will replace process.env.NODE_ENV with "production" whenever it finds it
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    setCode(result.outputFiles[0].text);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onCLick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
