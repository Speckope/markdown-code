import './CellList.css';
import React from 'react';
import AddCell from './AddCell';
import CellListItem from './CellListItem';
import { useTypedSelector } from './hooks/useTypedSelector';

interface CellListProps {}

const CellList: React.FC<CellListProps> = () => {
  // Extract oreder, data from cells and return cells in order!
  //   useTypedSelector(({ cells: { order, data } }) => {
  //     return order.map((id) => {
  //       return data[id];
  //     });
  //   });
  const cells = useTypedSelector(({ cells: { order, data } }) =>
    order.map((id) => data[id])
  );

  const renderedCells = cells.map((cell) => (
    <React.Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell previousCellId={cell.id} />
    </React.Fragment>
  ));

  return (
    <div className='cell-list'>
      <AddCell forceVisible={cells.length === 0} previousCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
