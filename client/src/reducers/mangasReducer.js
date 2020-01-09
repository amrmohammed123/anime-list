import { ADD_MANGAS, CLEAR_MANGAS } from "../actions";

const mangasReducer = (mangas = [], action) => {
  switch (action.type) {
    case ADD_MANGAS:
      return action.mangas;
    case CLEAR_MANGAS:
      return [];
  }
  return mangas;
};

export default mangasReducer;
