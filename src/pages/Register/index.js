import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { Form, Button } from 'semantic-ui-react';
import { useForm } from '../../utils/hooks';
import { AuthContext } from '../../context/auth';
import { ProfileImageSelector } from '../../components';
import { REGISTER_USER } from '../../utils/graphql';

function Register({ history: { push } }) {
  const { login } = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: '',
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } = {} }) {
      login(userData);
      push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  function registerUser() {
    addUser();
  }

  const pictures = [
    'https://react.semantic-ui.com/images/avatar/large/tom.jpg',
    'https://react.semantic-ui.com/images/avatar/large/daniel.jpg',
    'https://react.semantic-ui.com/images/avatar/large/elliot.jpg',
    'https://react.semantic-ui.com/images/avatar/large/steve.jpg',
    'https://react.semantic-ui.com/images/avatar/large/jenny.jpg',
    'https://react.semantic-ui.com/images/avatar/large/molly.png',
    'https://react.semantic-ui.com/images/avatar/large/matthew.png',
  ];

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="Username..."
          name="username"
          type="text"
          value={values.username}
          onChange={onChange}
          error={!!errors.username}
        />
        <ProfileImageSelector onChange={onChange} value={values.profileImage} pictures={pictures} />
        <Form.Input
          label="Email"
          placeholder="Email..."
          name="email"
          type="email"
          value={values.email}
          onChange={onChange}
          error={!!errors.email}
        />
        <Form.Input
          label="Password"
          placeholder="Password..."
          name="password"
          type="password"
          value={values.password}
          onChange={onChange}
          error={!!errors.password}
        />
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password..."
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={onChange}
          error={!!errors.confirmPassword}
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Register;
