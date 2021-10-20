import { useTypedSelector } from './useTypedSelector';

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    // Get order of cells.
    const { order, data } = state.cells;

    const showFunc = `
        import _React from 'react';
        import _ReactDOM from 'react-dom';
    
        var show = (value) => {
    
          const root = document.querySelector('#root');
    
          if(typeof value === 'object') {
    
            if(value.$$typeof && value.props) {
              _ReactDOM.render(value, root);
    
            } else {
              root.innerHTML = JSON.stringify(value);
            }
    
          } else {
            root.innerHTML = value;
          }
        };
      `;

    // noop - no operation. Show that doesn't do anything
    const showFuncNoop = 'var show = () => {};';

    // If we run this function for cell without shared environemnt
    if (!data[cellId].sharedEnvironment) {
      return [showFunc, data[cellId].content];
    }

    // Loop over cells and make an array with code in order, when cell is of code type
    const cumulativeCode: string[] = [];
    for (let id of order) {
      // Push content to new array
      if (data[id].type === 'code') {
        // Insert before code a show function
        if (id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          // If it's a code of a cell before, insert noop show.
          // This is so show in previous cells doesn't affect show in current cell.
          cumulativeCode.push(showFuncNoop);
        }

        // Push code into cumulative only if it shares environment
        if (data[id].sharedEnvironment) {
          cumulativeCode.push(data[id].content);
        }
      }
      // Break early if we go to id of current cell
      if (id === cellId) break;
    }
    // Return code array

    return cumulativeCode;
  }).join('\n');
};
