import React from 'react';
import CellListItem from './CellListItem';
import { useTypedSelector } from './hooks/useTypedSelector';

interface CellListProps {}

const CellList: React.FC<CellListProps> = ({}) => {
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
    <CellListItem key={cell.id} cell={cell} />
  ));

  return <div>{renderedCells}</div>;
};

export default CellList;
