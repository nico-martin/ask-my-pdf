import React from 'react';

import { Context, context } from './llmContext';

const useLlm = (): Context => React.useContext(context);

export default useLlm;
