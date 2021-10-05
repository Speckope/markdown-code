import React, { useEffect, useRef } from 'react';

interface PreviewProps {
  code: string;
}

const html = `
<html> 
  <head></head>
  <body>
    <div id="root"></div>
    <script>
      window.addEventListener('message', e => { 
        try {
          eval(e.data);
        } catch (err) {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err +  '</div>'
          console.error(err);
        }
      }, false);
    </script>
  </body>
</html>
`;

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Push new html file every time code is updated.
  useEffect(() => {
    iframeRef.current!.srcdoc = html;
    // setCode(result.outputFiles[0].text);
    iframeRef.current?.contentWindow?.postMessage(code, '*');
  }, [code]);

  return (
    <iframe
      ref={iframeRef}
      sandbox='allow-scripts'
      title='test'
      srcDoc={html}
    />
  );
};

export default Preview;
