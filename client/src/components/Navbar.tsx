import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useActions } from './hooks/useActions';
import { useTypedSelector } from './hooks/useTypedSelector';
import Login from './Login';
import './Navbar.css';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const { login } = useActions();
  let navigate = useNavigate();
  let location = useLocation();
  console.log(location.pathname);

  const data = useTypedSelector((state) => state.user);

  // Watch for url changes
  useEffect(() => {
    // Get accessToken
    const accessToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)jida\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    // On success, dispatch login action
    if (location.pathname.includes('/auth/success')) {
      console.log(accessToken);

      // Call login
      login(accessToken);

      // Replace current path
      navigate('/', { replace: true });
    }
  }, [location, login, navigate]);

  // To login after refresh.
  useEffect(() => {
    // Get accessToken
    const accessToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)jida\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );

    login(accessToken);
    // We only want it run on mount, and navbar won't be unmounting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='navbar'>
      <button className='button is-primary is-small login'>Save cells</button>
      {data.userName ? <div>{data.userName}</div> : <Login />}
    </div>
  );
};

export default Navbar;
