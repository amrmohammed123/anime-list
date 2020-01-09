import { CHANGE_MANGA_SEARCH } from "../actions";

const mangaSearchReducer = (mangaSearch = "", action) => {
  switch (action.type) {
    case CHANGE_MANGA_SEARCH:
      return action.search;
  }
  return mangaSearch;
};

export default mangaSearchReducer;
