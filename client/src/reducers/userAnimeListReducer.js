import {
  PUSH_TO_USER_ANIME_LIST,
  REMOVE_FROM_USER_ANIME_LIST,
  LOAD_USER_ANIME_LIST,
  EDIT_USER_ANIME_LIST_STATUS
} from "../actions";

const userAnimeListReducer = (userAnimeList = [], action) => {
  switch (action.type) {
    case PUSH_TO_USER_ANIME_LIST:
      return [...userAnimeList, action.anime];
    case REMOVE_FROM_USER_ANIME_LIST:
      return userAnimeList.filter(anime => anime.id !== action.id);
    case LOAD_USER_ANIME_LIST:
      return action.userAnimeList;
    case EDIT_USER_ANIME_LIST_STATUS:
      userAnimeList.map(anime => {
        if (anime.id === action.anime.id) anime.status = action.anime.status;
        return anime;
      });
  }
  return userAnimeList;
};

export default userAnimeListReducer;
