import React from 'react';

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  return (
    <button className='button is-primary is-small login'>
      <a href='http://localhost:4000/auth/github'>Login with Github</a>
    </button>
  );
};

export default Login;
