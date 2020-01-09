import { CHANGE_ANIME_SEARCH } from "../actions";

const animeSearchReducer = (animeSearch = "", action) => {
  switch (action.type) {
    case CHANGE_ANIME_SEARCH:
      return action.search;
  }
  return animeSearch;
};

export default animeSearchReducer;
