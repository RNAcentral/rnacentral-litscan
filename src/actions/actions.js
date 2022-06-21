import * as types from './actionTypes';
import routes from '../services/routes.jsx';
import {store} from '../app.jsx'


let buildQuery = function (selectedFacets) {
  let state = store.getState();
  let outputText, outputClauses = [];

  Object.keys(selectedFacets).map(facetId => {
    let facetText, facetClauses = [];
    selectedFacets[facetId].map(facetValueValue => facetClauses.push(`${facetId}:"${facetValueValue}"`));
    facetText = facetClauses.join(" OR ");

    if (facetText !== "") outputClauses.push("(" + facetText + ")");
  });

  if (state.filter) { outputClauses.push(" AND (" + state.filter + ")") }
  outputText = outputClauses.join(" AND ");
  return outputText;
};

export function getIdsNotScanned(list) {
  let idsNotScanned = [];

  return async function(dispatch) {
    for (let i = 0; i < list.length; i++) {
      let jobId = list[i];
      jobId && await fetch(routes.scannedId('"'+jobId+'"'), {
        method: 'GET',
      })
      .then(function (response) {
        if (response.ok) { return response.json() }
        else { throw response }
      })
      .then(data => {
        if (data["hitCount"] === 0) {
          idsNotScanned = [...idsNotScanned, jobId];
        }
        if (i === list.length - 1 && idsNotScanned.length){
          dispatch({type: types.NOT_SCANNED, data: idsNotScanned});
        }
      })
      .catch(error => console.log(error));
    }
  }
}

export function getRelatedIds(list, database) {
  let tempJobIds = [];

  return async function(dispatch) {
    for (let i = 0; i < list.length; i++) {
      let jobId = list[i];
      jobId && await fetch(routes.getMetadata('"'+jobId+'"', database), {
        method: 'GET',
      })
      .then(function (response) {
        if (response.ok) { return response.json() }
        else { throw response }
      })
      .then(data => {
        let getIds = data.entries.map(id => id.fields.job_id);
        getIds && getIds.map(id => tempJobIds = [...tempJobIds, id[0]]);
        if (i === list.length - 1){
          let jobIds = list.concat(tempJobIds);
          dispatch({type: types.JOB_IDS, data: jobIds});
          dispatch(onSubmitIds(jobIds));
        }
      })
      .catch(error => console.log(error));
    }
  }
}

export function onSubmitIds(list, order="score:descending") {
  let state = store.getState();

  // set id(s)
  let ids = list.map(id => 'job_id:' + '"' + id + '"').join(', ');
  ids = ids.replace(/,/g, '%20OR%20')

  // set ordering
  let sort = order.split(":");
  let sortField = sort[0];
  let disposition = sort[1];

  // set selectedFacets
  let facets = {};
  if (Object.keys(state.selectedFacets).length !== 0) {
    facets = state.selectedFacets
  }

  return function(dispatch) {
    if (state.status === "notSubmitted") { dispatch({type: types.UPDATE_STATUS}) }
    if (state.jobIds.length === 0) { dispatch({type: types.JOB_IDS, data: list}) }

    fetch(routes.searchIndex(ids, buildQuery(facets), sortField, disposition, state.start, state.size), {
      method: 'GET'
    })
    .then(function (response) {
      if (response.ok) { return response.json() }
      else { throw response }
    })
    .then(data => {
      dispatch({
        type: types.RESULTS,
        status: 'success',
        selectedFacets: facets,
        data: data,
        sortField: sortField,
        order: disposition
      })
    })
    .catch(error => dispatch({type: types.RESULTS, status: 'error'}));
  }
}

export function onToggleFacet(event, facet, facetValue, list) {
  return function (dispatch) {
    dispatch({ type: types.UPDATE_STATUS });
    dispatch({ type: types.TOGGLE_FACET });

    // escape ampersand in URL
    facetValue = {...facetValue, value: facetValue.value.replace(/&/g, "%26")};

    // get current state
    let state = store.getState();
    let selectedFacets = {...state.selectedFacets};

    if (!state.selectedFacets.hasOwnProperty(facet.id)) {  // all values in clicked facet are unchecked
      selectedFacets[facet.id] = [facetValue.value];
    } else {
      let index = state.selectedFacets[facet.id].indexOf(facetValue.value);
      if (index === -1) {
        selectedFacets[facet.id].push(facetValue.value);
      }  // this value is not checked, check it
      else {
        selectedFacets[facet.id].splice(index, 1); // this value is checked, uncheck it
        if (selectedFacets[facet.id].length === 0) { delete selectedFacets[facet.id]; }
      }
    }

    // set id(s)
    let ids = list.map(id => 'job_id:' + '"' + id + '"').join(', ');
    ids = ids.replace(/,/g, '%20OR%20')

    // start loading from the first page again
    return fetch(routes.searchIndex(ids, buildQuery(selectedFacets), state.sortField, state.order, 0, state.size))
      .then((response) => {
        if (response.ok) { return response.json(); }
        else { throw response; }
      })
      .then(data => {
        dispatch({
          type: types.RESULTS,
          status: 'success',
          selectedFacets: selectedFacets,
          data: data,
          sortField: state.sortField,
          order: state.order
        })
      })
      .catch(error => dispatch({type: types.RESULTS, status: 'error'}));
  }
}

export function onLoadMore(list) {
  let state = store.getState();
  let start = state.start === 0 ? 10 : state.start
  let size = state.entries.length + state.size < state.hitCount ? state.size : state.hitCount - state.entries.length;

  // set id(s)
  let ids = list.map(id => 'job_id:' + '"' + id + '"').join(', ');
  ids = ids.replace(/,/g, '%20OR%20')

  return function(dispatch) {
    // update status to loading
    dispatch({ type: types.LOAD_MORE, loadMoreStatus: 'loading' });

    // get next 10 results
    fetch(routes.searchIndex(ids, buildQuery(state.selectedFacets), state.sortField, state.order, start, size))
    .then((response) => {
      if (response.ok) { return response.json(); }
      else { throw response; }
    })
    .then(data => {
      dispatch({ type: types.LOAD_MORE, loadMoreStatus: 'success', data: data })
    })
    .catch(error => dispatch({type: types.LOAD_MORE, loadMoreStatus: 'error'}));
  }
}

export function onFilterChange(value) {
  return {type: types.FILTER_CHANGE, data: value}
}