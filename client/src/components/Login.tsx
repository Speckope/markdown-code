import React from 'react';

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  return (
    <a
      className='button is-primary is-small login'
      href='http://localhost:4000/auth/github'
    >
      Login with Github
    </a>
  );
};

export default Login;
