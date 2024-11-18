import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControls,
  FormElement,
  IconName,
  InputType,
  ButtonGroupAlign,
} from '@theme';
import { Settings } from '@store/settings/settingsContext.ts';
import { FeatureExtractionModel } from '@utils/vectorDB/VectorDB.ts';
import styles from './SettingsForm.module.css';
import {
  FEATURE_EXTRACTION_MODEL_METAS,
  INITIAL_SETTINGS,
} from '@store/settings/constants.ts';
import models from '@store/llm/models/index.ts';
import { formatBytes } from '@utils/functions.ts';
import { getLlmDownloaded } from '@store/llm/llmCookie.ts';
const SettingsForm: React.FC<{
  defaultValues: Settings;
  setValues: (data: Settings) => void;
}> = ({ defaultValues, setValues }) => {
  const form = useForm<Settings>({
    defaultValues,
  });
  const formValues = form.watch();

  const submitDisabled =
    JSON.stringify(formValues) === JSON.stringify(defaultValues);
  const resetDisabled =
    JSON.stringify(defaultValues) === JSON.stringify(INITIAL_SETTINGS);

  return (
    <Form onSubmit={form.handleSubmit(setValues)}>
      <FormElement<Settings>
        form={form}
        label="Language Model"
        name="languageModelId"
        input={InputType.SELECT}
        options={
          Object.values(models).reduce(
            (acc, curr) => ({
              ...acc,
              [curr.model.id]:
                curr.model.title +
                (curr.model.size
                  ? ` (${formatBytes(curr.model.size)}${getLlmDownloaded(curr.model) ? ' - cached' : ''})`
                  : ''),
            }),
            {}
          ) as Record<string, string>
        }
        Informations={
          <React.Fragment>
            <p>Available models:</p>
            <ul>
              {Object.values(models).map(({ model }) => (
                <li>
                  <a href={model.cardLink} target="_blank">
                    {model.title}
                    {model.size
                      ? ` (${formatBytes(model.size)}${getLlmDownloaded(model) ? ' - cached' : ''})`
                      : ''}
                  </a>
                </li>
              ))}
            </ul>
          </React.Fragment>
        }
      />
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
        rows={8}
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
        unit="%"
      />
      <FormElement<Settings>
        form={form}
        label="Embedding Model"
        name="featureExtractionModel"
        input={InputType.SELECT}
        options={
          Object.values(FeatureExtractionModel).reduce(
            (acc, curr) => ({ ...acc, [curr]: curr }),
            {}
          ) as Record<string, string>
        }
        Description={
          <p>
            If the model is changed, the document is re-indexed. This can take a
            while.
          </p>
        }
        Informations={
          <React.Fragment>
            <p>Available models:</p>
            <ul>
              {Object.values(FeatureExtractionModel).map((model) => (
                <li>
                  <a
                    href={FEATURE_EXTRACTION_MODEL_METAS[model].url}
                    target="_blank"
                  >
                    {model}
                  </a>
                </li>
              ))}
            </ul>
          </React.Fragment>
        }
      />
      <FormControls
        value="Save Settings"
        submitIcon={IconName.CONTENT_SAVE_OUTLINE}
        submitClassNameIconWrapper={styles.buttonIconWrapper}
        resetFunction={() => {
          Object.entries(INITIAL_SETTINGS).map(([key, value]) =>
            form.setValue(key as keyof Settings, value)
          );
          setValues(INITIAL_SETTINGS);
        }}
        resetText="Reset to Default"
        resetDisabled={resetDisabled}
        align={ButtonGroupAlign.SPACE_BETWEEN}
        submitDisabled={submitDisabled}
      />
    </Form>
  );
};

export default SettingsForm;
