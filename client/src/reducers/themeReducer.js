import { SET_THEME } from "../actions";

const themeReducer = (
  theme = localStorage.theme ? localStorage.theme : "light",
  action
) => {
  switch (action.type) {
    case SET_THEME:
      return action.theme;
  }
  return theme;
};

export default themeReducer;
