import { Paper, Title, TextInput, Group, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useContext } from 'react';
import { createUser } from '../api';
import { useNavigate } from '@tanstack/react-router';
import { UserContext } from '../context/UserContext';

export type CreateUserFormProps = {
  handleCancel: () => void;
};

export const CreateUserForm: React.FC<CreateUserFormProps> = ({
  handleCancel,
}) => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
    },
    validate: {
      username: (value) =>
        value && value.length > 3 && value.length < 12
          ? null
          : 'Username must be between 3 and 12 characters',
    },
  });

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const onSubmit = async (values: { username: string }) => {
    try {
      const user = await createUser(values.username);
      setUser(user);
      navigate({ to: '/' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      form.setErrors({ username: error.message });
    }
  };

  return (
    <Paper shadow="sm" p="lg">
      <Title mb="md">Sign up</Title>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          withAsterisk
          label="Username"
          placeholder="Enter your username"
          key={form.key('username')}
          {...form.getInputProps('username')}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Paper>
  );
};
