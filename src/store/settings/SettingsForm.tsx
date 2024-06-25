import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormElement, InputType } from '@theme';

interface FormValues {
  name: number;
  test: string;
  ready: boolean;
}

const SettingsForm: React.FC = () => {
  const form = useForm<FormValues>({
    defaultValues: { name: 2, test: 'test2' },
  });

  const values = form.watch();

  console.log(values);

  return (
    <Form onSubmit={form.handleSubmit((data) => console.log(data))}>
      <FormElement<FormValues>
        form={form}
        label="Name"
        name="name"
        input={InputType.RANGE}
        max={10}
        min={1}
        step={1}
        Description={<p>test</p>}
      />
      <FormElement<FormValues>
        form={form}
        label="Test"
        name="test"
        input={InputType.SELECT}
        options={{
          test: 'Test 1',
          test2: 'Test 2',
          test3: 'Test 3',
        }}
      />
      <FormElement<FormValues>
        form={form}
        label="Ready"
        name="ready"
        input={InputType.TOGGLE}
        Description={<p>test</p>}
      />
    </Form>
  );
};

export default SettingsForm;
