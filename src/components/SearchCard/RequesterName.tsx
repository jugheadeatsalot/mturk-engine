import * as React from 'react';
import { TextStyle } from '@shopify/polaris';
import { Text } from '@blueprintjs/core';
import { requesterLink } from '../../extras';

interface Props {
  readonly requesterId: string;
  readonly requesterName: string;
}

const RequesterName: React.SFC<Props> = ({requesterId, requesterName}) => {
  return (
    <TextStyle variation="strong">
      <Text>
        {requesterLink(requesterId, requesterName)}
      </Text>
    </TextStyle>
  );
};

export default RequesterName;
