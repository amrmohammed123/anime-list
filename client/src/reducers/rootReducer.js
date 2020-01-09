import { combineReducers } from "redux";
import animesReducer from "./animesReducer";
import mangasReducer from "./mangasReducer";
import animeSearchReducer from "./animeSearchReducer";
import mangaSearchReducer from "./mangaSearchReducer";
import userAnimeListReducer from "./userAnimeListReducer";
import userMangaListReducer from "./userMangaListReducer";
import userListsLoadedReducer from "./userListsLoadedReducer";
import themeReducer from "./themeReducer";

export default combineReducers({
  animes: animesReducer,
  mangas: mangasReducer,
  animeSearch: animeSearchReducer,
  mangaSearch: mangaSearchReducer,
  userAnimeList: userAnimeListReducer,
  userMangaList: userMangaListReducer,
  userListsLoaded: userListsLoadedReducer,
  theme: themeReducer
});
