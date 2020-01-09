import React, { Component } from "react";
import { connect } from "react-redux";
import { CircularProgress } from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  addItems,
  clearAnimes,
  clearMangas,
  changeAnimeSearch,
  changeMangaSearch,
  loadUserLists
} from "../../actions";
import Navbar from "../../components/Navbar";
import CardList from "../../components/CardList";
import SnackbarMessage from "../../components/SnackbarMessage";

const mapStateToProps = state => ({
  animes: state.animes,
  mangas: state.mangas,
  animeSearch: state.animeSearch,
  mangaSearch: state.mangaSearch,
  userAnimeList: state.userAnimeList,
  userMangaList: state.userMangaList,
  userListsLoaded: state.userListsLoaded
});
const mapDispatchToProps = dispatch => ({
  dispatch
});
class ShowItems extends Component {
  state = {
    showCircularProgress: true,
    hasMore: true,
    pageLimit: 10,
    currentOffset: 0,
    currentSearch: "",
    message: "",
    success: false
  };

  /* fetch next page from kitsu api */
  fetchData = () => {
    this.props
      .dispatch(
        addItems(
          this.props.itemType === "anime"
            ? this.props.animeSearch
            : this.props.mangaSearch,
          this.props.itemType,
          this.state.pageLimit,
          this.state.currentOffset
        )
      )
      .then(moreData => {
        if (moreData) {
          this.setState({
            currentOffset: this.state.currentOffset + 10,
            showCircularProgress: false,
            message: ""
          });
        } else {
          this.setState({ hasMore: false, message: "" });
        }
      })
      .catch(err => {
        this.setState({
          showCircularProgress: false,
          hasMore: false,
          message: "Couldn't load data",
          success: false
        });
      });
  };
  /* fetch data with the given search query */
  search = event => {
    event.preventDefault();
    if (this.props.itemType === "anime")
      this.props
        .dispatch(changeAnimeSearch(this.state.currentSearch))
        .then(() => this.props.dispatch(clearAnimes()))
        .then(() =>
          this.setState(
            {
              currentOffset: 0,
              hasMore: true,
              showCircularProgress: true
            },
            () => {
              this.fetchData();
            }
          )
        );
    else
      this.props
        .dispatch(changeMangaSearch(this.state.currentSearch))
        .then(() => this.props.dispatch(clearMangas()))
        .then(() =>
          this.setState(
            {
              currentOffset: 0,
              hasMore: true,
              showCircularProgress: true
            },
            () => {
              this.fetchData();
            }
          )
        );
  };
  /* update search current search value */
  updateSearch = event => {
    this.setState({ currentSearch: event.target.value });
  };
  /* close snackbar message */
  closeMessage = () => {
    this.setState({ message: "" });
  };
  /* fetch a page  from kitsu api*/
  componentDidMount() {
    let items =
      this.props.itemType === "anime" ? this.props.animes : this.props.mangas;
    if (items.length === 0) this.fetchData();
    // if items doesn't exist in the store fetch them
    else if (
      this.props.itemType === "anime" &&
      this.props.animeSearch.length !== 0
    ) {
      /* animes exist for a specific search so clear them and load new data */
      this.props
        .dispatch(clearAnimes())
        .then(() => this.props.dispatch(changeAnimeSearch("")))
        .then(() => this.fetchData());
    } else if (
      this.props.itemType === "manga" &&
      this.props.mangaSearch.length !== 0
    ) {
      /* mangas exist for a specific search so clear them and load new data */
      this.props
        .dispatch(clearMangas())
        .then(() => this.props.dispatch(changeMangaSearch("")))
        .then(() => this.fetchData());
    } else
      this.setState({
        showCircularProgress: false,
        currentOffset: items.length
      });
    // load user lists
    if (sessionStorage.username && !this.props.userListsLoaded)
      this.props.dispatch(loadUserLists()).catch(err => console.log(err));
  }
  render() {
    return (
      <>
        <Navbar
          search={this.search}
          searchChange={this.updateSearch}
          searchValue={this.state.currentSearch}
          showSearch={true}
        />
        {this.state.showCircularProgress ? (
          <CircularProgress
            style={{
              marginTop: `${window.innerHeight / 2 - 20}px`,
              marginLeft: `${window.innerWidth / 2 - 20}px`,
              color: this.props.theme === "dark" ? "#FFF" : ""
            }}
          />
        ) : (
          <InfiniteScroll
            dataLength={
              this.props.itemType === "anime"
                ? this.props.animes
                : this.props.mangas
            }
            next={this.fetchData}
            hasMore={this.state.hasMore}
            loader={
              <CircularProgress
                style={{
                  margin: "10px",
                  marginLeft: `${window.innerWidth / 2 - 20}px`,
                  color: this.props.theme === "dark" ? "#FFF" : ""
                }}
              />
            }
            style={{ overflowY: "hidden" }}
          >
            <CardList
              cards={
                this.props.itemType === "anime"
                  ? this.props.animes
                  : this.props.mangas
              }
              history={this.props.history}
              setMessage={(message, success) =>
                this.setState({ message, success })
              }
              itemType={this.props.itemType}
            />
          </InfiniteScroll>
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
export default connect(mapStateToProps, mapDispatchToProps)(ShowItems);
