import { Map } from 'immutable';
import { SearchResult, SearchResults } from '../types';
import { WorkerHit } from '../worker-mturk-api';

export const parseWorkerSearchPage = (
  html: Document,
  freshSearch?: boolean
): SearchResults => {
  const workerHits = searchResultsDocumentToWorkerHitArray(html);
  return tabulateSearchData(workerHits);
};

const tabulateSearchData = (input: WorkerHit[]): SearchResults =>
  input.reduce((map: SearchResults, hit: WorkerHit, index: number) => {
    const groupId = hit.hit_set_id;
    return map.set(groupId, createWorkerSearchItem(hit, index));
    // tslint:disable-next-line:align
  }, Map<string, SearchResult>());

const createWorkerSearchItem = (
  hit: WorkerHit,
  index: number
): SearchResult => ({
  title: hit.title,
  batchSize: hit.assignable_hits_count,
  description: hit.description,
  groupId: hit.hit_set_id,
  qualified: hit.caller_meets_preview_requirements,
  qualsRequired: hit.hit_requirements,
  requester: {
    id: hit.requester_id,
    name: hit.requester_name
  },
  timeAllottedInSeconds: hit.assignment_duration_in_seconds,
  reward: hit.monetary_reward.amount_in_dollars,
  index
});

const searchResultsDocumentToWorkerHitArray = (html: Document): WorkerHit[] => {
  const searchResultsDataNode = html.querySelector(
    'div.row.m-b-md > div.col-xs-12 > div'
  ) as Element;
  // const searchResultsDataString = searchResultsDataNode.getAttribute(
  //   'data-react-props'
  // ) as string;
  console.log(searchResultsDataNode);
  const searchResultsData = JSON.parse(searchResultsDataNode.getAttribute(
    'data-react-props'
  ) as string);
  return searchResultsData.bodyData;
};