import {
  PUSH_TO_USER_MANGA_LIST,
  REMOVE_FROM_USER_MANGA_LIST,
  LOAD_USER_MANGA_LIST,
  EDIT_USER_MANGA_LIST_STATUS
} from "../actions";

const userMangaListReducer = (userMangaList = [], action) => {
  switch (action.type) {
    case PUSH_TO_USER_MANGA_LIST:
      return [...userMangaList, action.manga];
    case REMOVE_FROM_USER_MANGA_LIST:
      return userMangaList.filter(manga => manga.id !== action.id);
    case LOAD_USER_MANGA_LIST:
      return action.userMangaList;
    case EDIT_USER_MANGA_LIST_STATUS:
      userMangaList.map(manga => {
        if (manga.id === action.manga.id) manga.status = action.manga.status;
        return manga;
      });
  }
  return userMangaList;
};

export default userMangaListReducer;
