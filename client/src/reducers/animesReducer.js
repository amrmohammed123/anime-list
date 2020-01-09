import { ADD_ANIMES, CLEAR_ANIMES } from "../actions";

const animesReducer = (animes = [], action) => {
  switch (action.type) {
    case ADD_ANIMES:
      return action.animes;
    case CLEAR_ANIMES:
      return [];
  }
  return animes;
};

export default animesReducer;
