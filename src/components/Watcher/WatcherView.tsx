import { Intent, ProgressBar } from '@blueprintjs/core';
import { Stack } from '@shopify/polaris';
import * as React from 'react';
import { connect } from 'react-redux';
import {
  cancelNextWatcherTick,
  deleteWatcher,
  EditableWatcherField,
  editWatcher,
  scheduleWatcher
} from '../../actions/watcher';
import { RootState } from '../../types';
import WatcherProgressDisplay from '../ProgressDisplay/WatcherProgressDisplay';
import InfoCallout from './InfoCallout';
import WatcherActions from './WatcherActions';
import WatcherHeading from './WatcherHeading';
import WatcherInfo from './WatcherInfo';
import WatcherSettings from './WatcherSettings';

interface OwnProps {
  readonly watcherId: string;
}

interface Props {
  readonly watcherActive: boolean;
}

interface Handlers {
  readonly onDelete: (id: string) => void;
  readonly onSchedule: (id: string, origin: number) => void;
  readonly onCancel: (id: string) => void;
  readonly onEdit: (
    id: string,
    field: EditableWatcherField,
    value: string | number
  ) => void;
}

class WatcherView extends React.PureComponent<
  OwnProps & Props & Handlers,
  never
> {
  private handleDelete = () => this.props.onDelete(this.props.watcherId);

  private handleToggle = () => {
    const { watcherActive, onCancel, watcherId, onSchedule } = this.props;
    watcherActive ? onCancel(watcherId) : onSchedule(watcherId, Date.now());
  };

  public render() {
    const { watcherId, watcherActive } = this.props;

    return (
      <Stack vertical key={watcherId}>
        <WatcherHeading
          watcherId={watcherId}
          onChange={(value: string) =>
            this.props.onEdit(this.props.watcherId, 'title', value)
          }
        />
        <WatcherInfo
          watcherId={watcherId}
          onChangeDescription={(value: string) =>
            this.props.onEdit(this.props.watcherId, 'description', value)
          }
        />
        <WatcherSettings
          watcherId={watcherId}
          onEdit={this.props.onEdit}
          onToggle={this.handleToggle}
        />
        <InfoCallout />
        <WatcherProgressDisplay
          id={watcherId}
          render={progress => (
            <ProgressBar
              intent={progress >= 1 ? Intent.PRIMARY : Intent.NONE}
              value={progress}
            />
          )}
        />
        <WatcherActions
          watcherActive={watcherActive}
          onDelete={this.handleDelete}
          onToggle={this.handleToggle}
        />
      </Stack>
    );
  }
}

const mapState = (state: RootState, ownProps: OwnProps): Props => ({
  watcherActive: state.watcherTimers.has(ownProps.watcherId)
});

const mapDispatch: Handlers = {
  onDelete: deleteWatcher,
  onCancel: cancelNextWatcherTick,
  onSchedule: scheduleWatcher,
  onEdit: editWatcher
};

export default connect(
  mapState,
  mapDispatch
)(WatcherView);
