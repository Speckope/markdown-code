import './Resizable.css';
import React, { useEffect, useState } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';

interface ResizableComponentProps {
  direction: 'horizontal' | 'vertical';
}

const ResizableComponent: React.FC<ResizableComponentProps> = ({
  children,
  direction,
}) => {
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  let resisableProps: ResizableBoxProps;

  useEffect(() => {
    // THIS IS DEBOUNCING
    let timer: NodeJS.Timeout;
    const listener = () => {
      // If timer is defined, clearTimeout
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        // Respect max constraints.
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };

    window.addEventListener('resize', listener);

    // Whenever we add and EventListener, we always want to cleanup after it.
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [width]);

  if (direction === 'horizontal') {
    resisableProps = {
      className: 'resize-horizontal',
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth * 0.75, Infinity],
      width,
      height: Infinity,
      resizeHandles: ['e'],
      // This function is called ater user finishes resizing
      onResizeStop: (event, data) => {
        setWidth(data.size.width);
      },
    };
  } else {
    resisableProps = {
      minConstraints: [Infinity, 36],
      maxConstraints: [Infinity, innerHeight * 0.9],
      resizeHandles: ['s'],
      width: Infinity,
      height: 300,
    };
  }

  return <ResizableBox {...resisableProps}>{children}</ResizableBox>;
};

export default ResizableComponent;
