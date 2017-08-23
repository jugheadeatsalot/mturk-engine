import * as React from 'react';
import {
  SearchItem,
  SearchMap,
  BlockedHit,
  HitBlockMap,
  RequesterMap,
  SortingOption
} from '../../types';
import { Stack, Card, ResourceList } from '@shopify/polaris';
import SearchCard from './SearchCard';
import SortingForm from './SortingOptions/SortingForm';
import SearchBar from '../../containers/SearchBar';
import EmptyHitTable from '../../containers/EmptySearchTable';
import { sortBy } from '../../utils/sorting';

export interface Props {
  readonly hits: SearchMap;
  readonly requesters: RequesterMap;
  readonly sortingOption: SortingOption;
  readonly blockedHits: HitBlockMap;
}

export interface Handlers {
  readonly onAccept: (hit: SearchItem) => void;
  readonly onHide: (hit: BlockedHit) => void;
  readonly onChangeSort: (option: SortingOption) => void;
}

// const random = (x: string) => console.log(x);

const HitTable = (props: Props & Handlers) => {
  const {
    hits,
    requesters,
    blockedHits,
    sortingOption,
    onAccept,
    onHide,
    onChangeSort
  } = props;

  const filterBlockedHits = (hits: SearchMap) =>
    hits.filter(
      (hit: SearchItem) => !blockedHits.get(hit.groupId)
    ) as SearchMap;

  const displayedHits = filterBlockedHits(hits)
    .sort(sortBy(sortingOption))
    .toArray();

  return hits.isEmpty() ? (
    <Stack vertical>
      <SearchBar />
      <EmptyHitTable />
    </Stack>
  ) : (
    <Stack vertical>
      <SearchBar />
      <Card title={`${displayedHits.length} HITs found.`}>
        <SortingForm onChange={onChangeSort} value={sortingOption} />
        <ResourceList
          items={displayedHits}
          renderItem={(hit: SearchItem) => (
            <SearchCard
              hit={hit}
              requester={requesters.get(hit.requesterId)}
              onClick={onAccept}
              onHide={onHide}
            />
          )}
        />
      </Card>
    </Stack>
  );
};

export default HitTable;
