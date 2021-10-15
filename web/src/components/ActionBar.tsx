import './ActionBar.css';
import React from 'react';
import { useActions } from './hooks/useActions';
import { Cell } from '../state';

interface ActionBarProps {
  id: string;
  sharedEnvironment?: boolean;
  type: Cell['type'];
}

const ActionBar: React.FC<ActionBarProps> = ({
  id,
  sharedEnvironment,
  type,
}) => {
  const { moveCell, deleteCell, toggleSharedEnvironmentCell } = useActions();

  return (
    <div className='action-bar'>
      {type === 'code' ? (
        <button
          className='button is-primary is-small'
          onClick={() => toggleSharedEnvironmentCell(id)}
        >
          <span className='icon'>
            <i
              className={`fas fa-${sharedEnvironment ? 'link' : 'unlink'}`}
            ></i>
          </span>
        </button>
      ) : null}

      <button
        className='button is-primary is-small'
        onClick={() => moveCell(id, 'up')}
      >
        <span className='icon'>
          <i className='fas fa-arrow-up'></i>
        </span>
      </button>
      <button
        className='button is-primary is-small'
        onClick={() => moveCell(id, 'down')}
      >
        <span className='icon'>
          <i className='fas fa-arrow-down'></i>
        </span>
      </button>
      <button
        className='button is-primary is-small'
        onClick={() => deleteCell(id)}
      >
        <span className='icon'>
          <i className='fas fa-times'></i>
        </span>
      </button>
    </div>
  );
};

export default ActionBar;
