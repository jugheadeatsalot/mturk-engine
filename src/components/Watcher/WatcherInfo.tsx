import * as React from 'react';
import { Card, TextContainer } from '@shopify/polaris';
import { EditableText } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { RootState, Requester } from 'types';
import { normalizedWatchers } from 'selectors/watchers';
import { truncate } from '../../utils/formatting';
import { requesterLink } from '../../extras';

interface OwnProps {
  readonly watcherId: string;
  readonly onChangeDescription: (value: string) => void;
}

interface Props {
  readonly description: string;
  readonly requester?: Requester;
}

interface State {
  readonly description: string;
  readonly editable: boolean;
}

class WatcherInfo extends React.PureComponent<Props & OwnProps, State> {
  public readonly state: State = {
    description: this.props.description,
    editable: false
  };

  private toggleEditableState = () =>
    this.setState((prevState: State) => ({
      editable: !prevState.editable
    }));

  private handleChange = (value: string) =>
    this.setState(() => ({
      description: value
    }));

  private resetDescription = () =>
    this.setState((prevState: State) => ({
      description: this.props.description,
      editable: false
    }));

  public render() {
    return (
      <Card
        title={this.props.requester ? (
            <h2 className="Polaris-Heading">
              {/* tslint:disable-next-line:max-line-length */}
              {requesterLink(this.props.requester.id, truncate(this.props.  requester.name, 20))} {requesterLink(this.props.requester.id, this.props.  requester.id)}
            </h2>
        ) : 'Description'}
        actions={[
          {
            content: this.state.editable ? 'Stop editing' : 'Edit description',
            onAction: this.toggleEditableState
          }
        ]}
      >
        <Card.Section>
          {this.state.editable ? (
            <EditableText
              multiline
              confirmOnEnterKey
              value={this.state.description}
              maxLength={1500}
              onChange={this.handleChange}
              onCancel={this.resetDescription}
              onConfirm={this.props.onChangeDescription}
              placeholder={`Click to edit description`}
            />
          ) : (
            <TextContainer>
              <TextContainer>{this.props.description || 'No description.'}</TextContainer>
            </TextContainer>
          )}
        </Card.Section>
      </Card>
    );
  }
}
const mapState = (state: RootState, ownProps: OwnProps): Props => ({
  requester: normalizedWatchers(state).get(ownProps.watcherId).requester,
  description: normalizedWatchers(state).get(ownProps.watcherId).description
});

export default connect(mapState)(WatcherInfo);
