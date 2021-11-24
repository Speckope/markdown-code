import React from 'react';

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  return (
    <button className='button is-primary is-small login'>
      Login with Github
    </button>
  );
};

export default Login;
