import set from 'set-value';
import { appendTypeToToken } from '@/app/components/createTokenObj';

export default function stringifyTokens(tokens, activeTokenSet) {
  const tokenObj = {};
  tokens[activeTokenSet].forEach((token) => {
    const tokenWithType = appendTypeToToken(token);
    const { name, ...tokenWithoutName } = tokenWithType;
    set(tokenObj, token.name, tokenWithoutName);
  });

  return JSON.stringify(tokenObj, null, 2);
}
