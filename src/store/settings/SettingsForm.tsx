import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControls, FormElement, InputType } from '@theme';
import { Settings } from '@store/settings/settingsContext.ts';
import { INITIAL_SETTINGS } from '@store/settings/constants.ts';
import { FeatureExtractionModel } from '@utils/vectorDB/VectorDB.ts';

const SettingsForm: React.FC = () => {
  const form = useForm<Settings>({
    defaultValues: INITIAL_SETTINGS,
  });

  return (
    <Form onSubmit={form.handleSubmit((data) => console.log(data))}>
      <FormElement<Settings>
        form={form}
        label="Prompt Template"
        name="promptTemplate"
        input={InputType.TEXTAREA}
        Description={
          <React.Fragment>
            <p>
              The prompt that will be used for the LLM. The following
              placeholders will be replaced:
            </p>
            <ul>
              <li>{'{documentTitle}'}</li>
              <li>{'{results}'}</li>
              <li>{'{question}'}</li>
            </ul>
          </React.Fragment>
        }
        rows={13}
      />
      <FormElement<Settings>
        form={form}
        label="Surrounding Results"
        name="resultsBeforeAndAfter"
        input={InputType.RANGE}
        Description={
          <p>
            Each result uses the number of sentences set here before and after
            within the same paragraph as context.
          </p>
        }
        min={0}
        max={10}
      />
      <FormElement<Settings>
        form={form}
        label="Max Number of Results"
        name="maxNumberOfResults"
        input={InputType.RANGE}
        min={0}
        max={10}
      />
      <FormElement<Settings>
        form={form}
        label="Similarity Threshold"
        name="similarityThreshold"
        input={InputType.RANGE}
        Description={
          <p>
            Only results with a similarity score above this threshold will be
            used in the prompt.
          </p>
        }
        min={0}
        max={100}
      />
      <FormElement<Settings>
        form={form}
        label="Embedding Model"
        name="model"
        input={InputType.SELECT}
        options={FeatureExtractionModel}
      />
      <FormControls />
    </Form>
  );
};

export default SettingsForm;
