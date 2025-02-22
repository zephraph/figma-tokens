/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import { useSelector } from 'react-redux';
import { mergeTokenGroups, resolveTokenValues } from '@/plugin/tokenHelpers';
import TokenListing from './TokenListing';
import TokensBottomBar from './TokensBottomBar';
import ToggleEmptyButton from './ToggleEmptyButton';
import { mappedTokens } from './createTokenObj';
import { RootState } from '../store';
import TokenSetSelector from './TokenSetSelector';
import TokenFilter from './TokenFilter';
import EditTokenFormModal from './EditTokenFormModal';

interface TokenListingType {
  label: string;
  property: string;
  type: string;
  values: object;
  help?: string;
  explainer?: string;
  schema?: {
    value: object | string;
    options: object | string;
  };
}

function Tokens({ isActive }: { isActive: boolean }) {
  const { tokens, usedTokenSet, activeTokenSet } = useSelector((state: RootState) => state.tokenState);
  const { showEditForm, tokenFilter, tokenFilterVisible } = useSelector((state: RootState) => state.uiState);

  const resolvedTokens = React.useMemo(() => resolveTokenValues(mergeTokenGroups(tokens, [...usedTokenSet, activeTokenSet])), [tokens, usedTokenSet, activeTokenSet]);

  const memoizedTokens = React.useMemo(() => {
    if (tokens[activeTokenSet]) {
      return mappedTokens(tokens[activeTokenSet], tokenFilter).sort((a, b) => {
        if (b[1].values) {
          return 1;
        }
        if (a[1].values) {
          return -1;
        }
        return 0;
      });
    }
    return [];
  }, [tokens, activeTokenSet, tokenFilter]);

  if (!isActive) return null;

  return (
    <div>
      <TokenSetSelector />
      {tokenFilterVisible && <TokenFilter />}
      {memoizedTokens.map(([key, group]: [string, TokenListingType]) => (
        <div key={key}>
          <TokenListing
            tokenKey={key}
            label={group.label || key}
            explainer={group.explainer}
            schema={group.schema}
            property={group.property}
            tokenType={group.type}
            values={group.values}
            resolvedTokens={resolvedTokens}
          />
        </div>
      ))}
      {showEditForm && <EditTokenFormModal resolvedTokens={resolvedTokens} />}
      <ToggleEmptyButton />
      <TokensBottomBar />
    </div>
  );
}

export default Tokens;
