import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { connect } from "react-redux";
import ShowItems from "./components/ShowItems";
import ItemDetails from "./components/ItemDetails";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";

const mapStateToProps = state => ({
  theme: state.theme
});

const App = props => {
  document.body.style.backgroundColor =
    props.theme === "light" ? "#FFF" : "#1F1F1F";
  return (
    <Router>
      <Switch>
        <Route
          path="/anime"
          component={props => <ShowItems itemType="anime" {...props} />}
          exact
        />
        <Route path="/anime/:id" component={ItemDetails} exact />
        <Route
          path="/manga"
          component={props => <ShowItems itemType="manga" {...props} />}
          exact
        />
        <Route path="/manga/:id" component={ItemDetails} exact />
        <Route path="/signup" component={Signup} exact />
        <Route path="/login" component={Login} exact />
        <Route path="/forgotPassword" component={ForgotPassword} exact />
        <Route path="/profile/:username" component={Profile} exact />
        <Redirect from="/" to="/anime" />
      </Switch>
    </Router>
  );
};

export default connect(mapStateToProps, null)(App);
