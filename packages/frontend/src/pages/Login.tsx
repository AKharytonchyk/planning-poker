import { Container } from '@mantine/core';
import React, { useContext } from 'react';
import { LoginUserForm } from '../components/LoginUserForm';
import { CreateUserForm } from '../components/CreateUserForm';

const Login: React.FC = () => {
  const [isLoginView, setIsLoginView] = React.useState(true);

  return (
    <Container size={500} style={{ marginTop: '100px' }}>
      {isLoginView ? (
        <LoginUserForm handleCreateUid={() => setIsLoginView(false)} />
      ) : (
        <CreateUserForm handleCancel={() => setIsLoginView(true)} />
      )}
    </Container>
  );
};

export default Login;
