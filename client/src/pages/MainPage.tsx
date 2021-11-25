import React from 'react';
import CellList from '../components/CellList';
import Navbar from '../components/Navbar';

interface MainPageProps {}

const MainPage: React.FC<MainPageProps> = () => {
  return (
    <div>
      <Navbar />
      <CellList />
    </div>
  );
};

export default MainPage;
