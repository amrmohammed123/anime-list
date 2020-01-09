import React, { Component } from "react";
import { connect } from "react-redux";
import { CircularProgress, Tabs, Tab } from "@material-ui/core";
import { loadUserLists } from "../../actions";
import Navbar from "../../components/Navbar";
import ProfileCardList from "../../components/ProfileCardList";
import SnackbarMessage from "../../components/SnackbarMessage";
import styles from "./Profile.module.scss";

const mapStateToProps = state => ({
  animes: state.userAnimeList,
  mangas: state.userMangaList,
  userListsLoaded: state.userListsLoaded,
  theme: state.theme
});
const mapDispatchToProps = dispatch => ({
  dispatch
});

class Profile extends Component {
  state = {
    message: "",
    success: false,
    showCircularProgress: true,
    animes: [],
    mangas: [],
    currentTab: 0 // 0 for anime list, 1 for manga list
  };
  currentUserName = this.props.match.params.username;
  sameUser =
    sessionStorage.username && sessionStorage.username === this.currentUserName;
  /* close snackbar message */
  closeMessage = () => {
    this.setState({ message: "" });
  };
  handleTabsChange = (event, value) => {
    this.setState({ currentTab: value });
  };
  componentDidMount() {
    // load user lists
    if (this.sameUser) {
      // the profile is of the logged in user
      if (!this.props.userListsLoaded) {
        // load the current logged in user lists
        this.props
          .dispatch(loadUserLists())
          .then(() => this.setState({ showCircularProgress: false }))
          .catch(err => console.log(err));
      } else this.setState({ showCircularProgress: false });
    } else {
      // the profile isn't of the logged in user
      // load lists from server
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/user/${this.currentUserName}/list`
      )
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        })
        .then(response => {
          this.setState({
            animes: response.animeList,
            mangas: response.mangaList,
            showCircularProgress: false
          });
        })
        .catch(error => {
          this.setState({
            message: "Couldn't Load Data",
            success: false,
            showCircularProgress: false
          });
        });
    }
  }
  render() {
    return (
      <>
        <Navbar showSearch={false} />
        {this.state.showCircularProgress ? (
          <CircularProgress
            style={{
              marginTop: `${window.innerHeight / 2 - 20}px`,
              marginLeft: `${window.innerWidth / 2 - 20}px`,
              color: this.props.theme === "dark" ? "#FFF" : ""
            }}
          />
        ) : (
          <div>
            <h2
              className={styles.username}
              style={{ color: this.props.theme === "dark" ? "#FFFF" : "#000" }}
            >
              {this.currentUserName}
            </h2>
            <Tabs
              indicatorColor="primary"
              textColor="primary"
              value={this.state.currentTab}
              onChange={this.handleTabsChange}
              classes={{
                indicator: this.props.theme === "dark" ? styles.white : ""
              }}
            >
              <Tab
                classes={{
                  root: styles.tab
                }}
                style={{
                  marginLeft: "auto",
                  color: this.props.theme === "dark" ? "#FFF" : ""
                }}
                label="Anime List"
              />
              <Tab
                classes={{ root: styles.tab }}
                style={{
                  marginRight: "auto",
                  color: this.props.theme === "dark" ? "#FFF" : ""
                }}
                label="Manga List"
              />
            </Tabs>

            {this.state.currentTab ? (
              <ProfileCardList
                cards={this.sameUser ? this.props.mangas : this.state.mangas}
                history={this.props.history}
                setMessage={(message, success) =>
                  this.setState({ message, success })
                }
                itemType="manga"
              />
            ) : (
              <ProfileCardList
                cards={this.sameUser ? this.props.animes : this.state.animes}
                history={this.props.history}
                setMessage={(message, success) =>
                  this.setState({ message, success })
                }
                itemType="anime"
              />
            )}
          </div>
        )}
        {this.state.message && (
          <SnackbarMessage
            message={this.state.message}
            success={this.state.success}
            close={this.closeMessage}
          />
        )}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
