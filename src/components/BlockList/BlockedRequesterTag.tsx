import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState, BlockedRequester } from '../../types';
import { Tag } from '@shopify/polaris';
import {
  UnblockRequester,
  unblockSingleRequester
} from '../../actions/blockRequester';

import { truncate } from '../../utils/formatting';
import { requesterLink } from '../../extras';

export interface Props {
  readonly requester: BlockedRequester;
}

export interface OwnProps {
  readonly blockedRequesterId: string;
}

export interface Handlers {
  readonly onUnblock: (groupId: string) => void;
}

class BlockedHitCard extends React.PureComponent<
  Props & OwnProps & Handlers,
  never
> {
  private handleUnblock = () => this.props.onUnblock(this.props.requester.id);

  public render() {
    return (
      <div className="blockedRequesterTag">
        <div title={this.props.requester.name} className="Polaris-Tag">
          {requesterLink(this.props.requester.id, truncate(this.props.requester.name, 20))}
        </div>
        <Tag onRemove={this.handleUnblock}/>
      </div>
    );
  }
}

const mapState = (state: RootState, ownProps: OwnProps): Props => ({
  requester: state.requesterBlocklist.get(ownProps.blockedRequesterId)
});

const mapDispatch = (dispatch: Dispatch<UnblockRequester>): Handlers => ({
  onUnblock: (id: string) => dispatch(unblockSingleRequester(id))
});

export default connect(mapState, mapDispatch)(BlockedHitCard);
