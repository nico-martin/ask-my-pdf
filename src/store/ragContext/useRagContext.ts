import React from 'react';
import ragContext, { RagContext } from './ragContext';

const useRagContext = (): RagContext => React.useContext(ragContext);

export default useRagContext;
