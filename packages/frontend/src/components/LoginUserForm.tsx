import { TextInput, Group, Button, Paper, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { getUser } from '../api';

export type LoginUserFormProps = {
  handleCreateUid: () => void;
};

export const LoginUserForm: React.FC<LoginUserFormProps> = ({
  handleCreateUid,
}) => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      UID: '',
    },
    validate: {
      UID: (value) =>
        value &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          value,
        )
          ? null
          : 'UID must be a valid UID v4',
    },
  });

  const onSubmit = async (values: { UID: string }) => {
    try {
      const user = await getUser(values.UID);
      console.log(user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      form.setErrors({ UID: error.message });
    }
  };

  return (
    <Paper shadow="sm" p="lg">
      <Title mb="md">Login</Title>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          withAsterisk
          label="UID"
          placeholder="Enter your UID"
          key={form.key('UID')}
          {...form.getInputProps('UID')}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
          <Button variant="outline" onClick={handleCreateUid}>
            Create New UID
          </Button>
        </Group>
      </form>
    </Paper>
  );
};
