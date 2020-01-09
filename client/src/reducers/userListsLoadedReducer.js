import { SET_USER_LISTS_LOADED } from "../actions";

const userListsLoadedReducer = (userListsLoaded = false, action) => {
  switch (action.type) {
    case SET_USER_LISTS_LOADED:
      return true;
  }
  return userListsLoaded;
};

export default userListsLoadedReducer;
