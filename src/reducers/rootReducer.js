import * as actions from "../actions/actionTypes";
import initialState from "../store/initialState";


const rootReducer = function (state = initialState, action) {
  let newState;

  switch (action.type) {
    case actions.UPDATE_STATUS:
      return Object.assign({}, state, {status: "running"});

    case actions.JOB_IDS:
      return Object.assign({}, state, {jobIds: action.data});

    case actions.NOT_SCANNED:
      return Object.assign({}, state, {idsNotScanned: action.data});

    case actions.RESULTS:
      switch (action.status) {
        case 'success':
          return Object.assign({}, state, {
            status: "success",
            hitCount: action.data.hitCount,
            entries: [...action.data.entries ],
            facets: [...action.data.facets],
            selectedFacets: action.selectedFacets,
            sortField: action.sortField,
            order: action.order,
          });
        case 'error':
          return Object.assign({}, state, {status: "error"});
        default:
          return newState;
      }

    case actions.TOGGLE_FACET:
      return Object.assign({}, state, {start: 0});

    case actions.LOAD_MORE:
      switch (action.loadMoreStatus) {
        case 'loading':
          return Object.assign({}, state, {loadMoreStatus: "loading"});
        case 'success':
          return Object.assign({}, state, {
            loadMoreStatus: "success",
            entries: [...state.entries, ...action.data.entries],
            start: state.entries.length + action.data.entries.length,
          });
        case 'error':
          return Object.assign({}, state, {loadMoreStatus: "error"});
        default:
          return newState;
      }

    case actions.FILTER_CHANGE:
      return Object.assign({}, state, {filter: action.data});

    default:
      return state;
  }
};

export default rootReducer;