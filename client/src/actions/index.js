/* actions */
export const ADD_ANIMES = "ADD_ANIMES";
export const ADD_MANGAS = "ADD_MANGAS";
export const CLEAR_ANIMES = "CLEAR_ANIMES";
export const CLEAR_MANGAS = "CLEAR_MANGAS";
export const CHANGE_ANIME_SEARCH = "CHANGE_ANIME_SEARCH";
export const CHANGE_MANGA_SEARCH = "CHANGE_MANGA_SEARCH";
export const PUSH_TO_USER_ANIME_LIST = "PUSH_TO_USER_ANIME_LIST";
export const PUSH_TO_USER_MANGA_LIST = "PUSH_TO_USER_MANGA_LIST";
export const LOAD_USER_ANIME_LIST = "LOAD_USER_ANIME_LIST";
export const LOAD_USER_MANGA_LIST = "LOAD_USER_MANGA_LIST";
export const SET_USER_LISTS_LOADED = "SET_USER_LISTS_LOADED";
export const REMOVE_FROM_USER_MANGA_LIST = "REMOVE_FROM_USER_MANGA_LIST";
export const REMOVE_FROM_USER_ANIME_LIST = "REMOVE_FROM_USER_ANIME_LIST";
export const EDIT_USER_ANIME_LIST_STATUS = "EDIT_USER_ANIME_LIST_STATUS";
export const EDIT_USER_MANGA_LIST_STATUS = "EDIT_USER_MANGA_LIST_STATUS";
export const SET_THEME = "SET_THEME";

/* action creators */
export const addItems = (search, itemType, pageLimit, currentOffset) => {
  return (dispatch, getState) => {
    /* constuct url taking into consideration whether the operation is search or just a normal fetch */
    let url = "";
    if (search) {
      url = encodeURI(
        `https://kitsu.io/api/edge/${itemType}?filter[text]=${search}&page[limit]=${pageLimit}&page[offset]=${currentOffset}`
      );
    } else {
      url = encodeURI(
        `https://kitsu.io/api/edge/${itemType}?page[limit]=${pageLimit}&page[offset]=${currentOffset}&sort=popularityRank`
      );
    }
    /* fetch the page */
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(response => {
        if (response.data.length) {
          if (itemType === "anime") {
            dispatch({
              type: ADD_ANIMES,
              animes: getState().animes.concat(
                response.data.map(item => ({
                  title:
                    item.attributes.titles.en ||
                    item.attributes.titles.en_us ||
                    item.attributes.titles.en_jp ||
                    item.attributes.slug,
                  poster:
                    item.attributes.posterImage.original ||
                    item.attributes.posterImage.large ||
                    item.attributes.posterImage.medium,
                  itemId: item.id
                }))
              )
            });
          } else {
            // item is manga
            dispatch({
              type: ADD_MANGAS,
              mangas: getState().mangas.concat(
                response.data.map(item => ({
                  title:
                    item.attributes.titles.en ||
                    item.attributes.titles.en_us ||
                    item.attributes.titles.en_jp ||
                    item.attributes.slug,
                  poster:
                    item.attributes.posterImage.original ||
                    item.attributes.posterImage.large ||
                    item.attributes.posterImage.medium,
                  itemId: item.id
                }))
              )
            });
          }
          return Promise.resolve(true);
        } else {
          /* no more data */
          return Promise.resolve(false);
        }
      })
      .catch(err => Promise.reject());
  };
};

export const clearAnimes = () => {
  return dispatch => {
    dispatch({ type: CLEAR_ANIMES });
    return Promise.resolve();
  };
};

export const clearMangas = () => {
  return dispatch => {
    dispatch({ type: CLEAR_MANGAS });
    return Promise.resolve();
  };
};

export const changeAnimeSearch = search => {
  return dispatch => {
    dispatch({
      type: CHANGE_ANIME_SEARCH,
      search
    });
    return Promise.resolve();
  };
};

export const changeMangaSearch = search => {
  return dispatch => {
    dispatch({
      type: CHANGE_MANGA_SEARCH,
      search
    });
    return Promise.resolve();
  };
};

export const pushToUserAnimeList = anime => {
  return dispatch => {
    dispatch({
      type: PUSH_TO_USER_ANIME_LIST,
      anime
    });
    return Promise.resolve();
  };
};
export const pushToUserMangaList = manga => {
  return dispatch => {
    dispatch({
      type: PUSH_TO_USER_MANGA_LIST,
      manga
    });
    return Promise.resolve();
  };
};
export const loadUserLists = () => {
  return dispatch => {
    return fetch(
      `${process.env.REACT_APP_SERVER_URL}/user/${sessionStorage.username}/list`
    )
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(response => {
        dispatch({
          type: LOAD_USER_ANIME_LIST,
          userAnimeList: response.animeList
        });
        dispatch({
          type: LOAD_USER_MANGA_LIST,
          userMangaList: response.mangaList
        });
        dispatch({ type: SET_USER_LISTS_LOADED });
        return Promise.resolve();
      })
      .catch(err => Promise.reject());
  };
};

export const removeFromUserAnimeList = id => {
  return dispatch => {
    dispatch({
      type: REMOVE_FROM_USER_ANIME_LIST,
      id
    });
    return Promise.resolve();
  };
};

export const removeFromUserMangaList = id => {
  return dispatch => {
    dispatch({
      type: REMOVE_FROM_USER_MANGA_LIST,
      id
    });
    return Promise.resolve();
  };
};

export const editUserMangaListStatus = (id, status) => {
  return dispatch => {
    dispatch({
      type: EDIT_USER_MANGA_LIST_STATUS,
      manga: { id, status }
    });
    return Promise.resolve();
  };
};

export const editUserAnimeListStatus = (id, status) => {
  return dispatch => {
    dispatch({
      type: EDIT_USER_ANIME_LIST_STATUS,
      anime: { id, status }
    });
    return Promise.resolve();
  };
};

export const setTheme = theme => {
  return dispatch => {
    dispatch({
      type: SET_THEME,
      theme
    });
    return Promise.resolve();
  };
};
