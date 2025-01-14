import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import useTokens from '../store/useTokens';
import Box from './Box';
import Blankslate from './Blankslate';
import AnnotationBuilder from './AnnotationBuilder';

export default function InspectorDebugView() {
  const uiState = useSelector((state: RootState) => state.uiState);
  const { findToken } = useTokens();

  return (
    <Box css={{
      display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '$4',
    }}
    >
      <AnnotationBuilder />

      {Object.entries(uiState.mainNodeSelectionValues).length > 0
        ? (
          <div className="space-y-1">
            {Object.entries(uiState.mainNodeSelectionValues)
              .filter(([, value]) => value !== 'delete')
              .map(([property, value]) => (
                <div key={property} className="flex flex-row items-start justify-between">
                  <code className="flex flex-wrap space-x-2">
                    <div className="font-bold">{property}</div>
                    :
                    {' '}
                    <div className="p-1 text-white bg-gray-700 rounded text-xxs">
                      $
                      {typeof value === 'string' && value.split('.').join('-')}
                    </div>
                    <div className="text-gray-500 break-all">{`/* ${JSON.stringify(findToken(value))} */`}</div>
                  </code>
                </div>
              ))}
          </div>
        )
        : <Blankslate title={uiState.selectedLayers ? 'No tokens found' : 'No layers selected'} text={uiState.selectedLayers ? 'None of the selected layers contain any tokens' : 'Select a layer to see applied tokens'} />}
    </Box>
  );
}
