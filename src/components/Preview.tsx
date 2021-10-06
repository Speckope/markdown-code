import './Preview.css';
import React, { useEffect, useRef } from 'react';

interface PreviewProps {
  code: string;
  err: string;
}

const html = `
<html> 
  <head></head>
  <body>
    <div id="root"></div>
    <script>
    
      const handleError = (err) => {
        const root = document.querySelector('#root');
        root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err +  '</div>'
        console.error(err);
      };
      
       window.addEventListener('error', (event) => {
        handleError(event.error)
       });

      window.addEventListener('message', event => { 
        try {
          eval(event.data);
        } catch (err) {
          handleError(err);
        };

      }, false);
    </script>
  </body>
</html>
`;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    iframeRef.current!.srcdoc = html;

    // setTimeout is neccesary to give time to the new html document to set up event listener.
    // Without it, we post message to the previous html document and we end up with new, blank
    // html when it gets updated from the code above!
    setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className='preview-wrapper'>
      <iframe
        ref={iframeRef}
        sandbox='allow-scripts'
        title='test'
        srcDoc={html}
      />

      {err && <div className='preview-error'>{err}</div>}
    </div>
  );
};

export default Preview;
