import React, { Component } from "react";
import { Button, TextField } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { connect } from "react-redux";
import {
  loadUserLists,
  removeFromUserAnimeList,
  removeFromUserMangaList
} from "../../actions";
import Navbar from "../Navbar";
import AddToListPopup from "../AddToListPopup";
import Review from "../Review";
import SnackbarMessage from "../SnackbarMessage";
import styles from "./ItemDetails.module.scss";

const mapStateToProps = state => ({
  userAnimeList: state.userAnimeList,
  userMangaList: state.userMangaList,
  userListsLoaded: state.userListsLoaded,
  theme: state.theme
});
const mapDispatchToProps = dispatch => ({
  dispatch
});
class ItemDetails extends Component {
  state = {
    showMore: false,
    open: false,
    addedToList: false,
    action: "add",
    type: "",
    title: "",
    poster: "",
    plot: "",
    message: "",
    success: false,
    startDate: "",
    endDate: "",
    status: "",
    rating: "",
    chapterCount: "",
    episodeCount: "",
    breakPoint: 600,
    reviews: [],
    reviewInput: "",
    moreReviews: true,
    page: 0
  };
  itemType = "";
  itemId = "";
  closeMessage = () => {
    this.setState({ message: "" });
  };
  handleOpen = action => {
    if (!sessionStorage.username) this.props.history.push("/login");
    else this.setState({ open: true, action });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  setMessage = (message, success) => {
    this.setState({ message, success });
  };
  handleRemove = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/user/list`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({
        id: this.itemId,
        type: this.itemType,
        action: "delete"
      })
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        // add to redux store
        if (this.itemType === "anime") {
          this.props.dispatch(removeFromUserAnimeList(this.itemId)).then(() => {
            this.setState({ addedToList: false }, () => {
              this.setMessage("item removed from your list", true);
            });
          });
        } else {
          this.props.dispatch(removeFromUserMangaList(this.itemId)).then(() => {
            this.setState({ addedToList: false }, () => {
              this.setMessage("item removed from your list", true);
            });
          });
        }
      })
      .catch(error => {
        this.setMessage(`Couldn't remove item`, false);
      });
  };
  handleReviewInputChange = event => {
    if (event.target.value !== "\n")
      this.setState({ reviewInput: event.target.value });
  };
  handleKeyPress = event => {
    if (event.which == 13 && !event.shiftKey) {
      // 13 for Enter
      // add the review to the ui
      let reviewContent = this.state.reviewInput.trim();
      if (reviewContent.length === 0)
        // check for empty input
        return;
      this.setState({
        reviews: [
          ...this.state.reviews,
          {
            author: sessionStorage.username,
            content: reviewContent,
            likes: 0,
            liked: false
          }
        ],
        reviewInput: ""
      });
      fetch(`${process.env.REACT_APP_SERVER_URL}/item`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          path: this.props.history.location.pathname,
          content: reviewContent
        })
      })
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
        })
        .catch(err => {
          this.setState({
            message: "Couldn't Save Review",
            success: false
          });
        });
    }
  };
  loadReviews = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/item/reviews`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        path: this.props.history.location.pathname,
        page: this.state.page
      })
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(response => {
        if (response.reviews && response.reviews.length > 0)
          this.setState({
            reviews: this.state.reviews.concat(response.reviews),
            page: this.state.page + 10,
            moreReviews: response.reviews.length % 10 === 0
          });
        else this.setState({ moreReviews: false });
      })
      .catch(err => {
        this.setState({
          message: "Couldn't Load Reviews",
          success: false
        });
      });
  };
  componentDidMount() {
    const temp = this.props.history.location.pathname.split("/");
    this.itemType = temp[1];
    this.itemId = temp[2];
    // load item details
    fetch(
      `https://kitsu.io/api/edge/${this.itemType}?filter[id]=${this.itemId}`
    )
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(response => {
        this.setState({
          type: response.data[0].type,
          title:
            response.data[0].attributes.titles.en ||
            response.data[0].attributes.titles.en_us ||
            response.data[0].attributes.titles.en_jp ||
            response.data[0].attributes.slug,
          poster:
            response.data[0].attributes.posterImage.original ||
            response.data[0].attributes.posterImage.large ||
            response.data[0].attributes.posterImage.medium,
          plot: response.data[0].attributes.synopsis,
          episodeCount: response.data[0].attributes.episodeCount,
          chapterCount: response.data[0].attributes.chapterCount,
          startDate: response.data[0].attributes.startDate,
          endDate: response.data[0].attributes.endDate,
          status: response.data[0].attributes.status,
          publisher: response.data[0].attributes.serialization,
          rating: Math.round(response.data[0].attributes.averageRating) / 10
        });
      })
      .catch(err => {
        this.setState({ message: "Couldn't load data", success: false });
      });
    // load user lists (if they weren't loaded already)
    if (sessionStorage.username && !this.props.userListsLoaded)
      this.props.dispatch(loadUserLists()).catch(err => console.log(err));
    // load reviews
    this.loadReviews();
  }
  componentDidUpdate() {
    // determine whether current item is already added to user lists
    if (!this.state.addedToList) {
      if (this.itemType === "anime") {
        for (let i = 0; i < this.props.userAnimeList.length; i++) {
          if (this.props.userAnimeList[i].id === this.itemId) {
            this.setState({ addedToList: true });
            break;
          }
        }
      } else {
        for (let i = 0; i < this.props.userMangaList.length; i++) {
          if (this.props.userMangaList[i].id === this.itemId) {
            this.setState({ addedToList: true });
            break;
          }
        }
      }
    }
  }
  render() {
    return (
      <>
        <Navbar showSearch={false} />
        <div className={styles.ItemDetails}>
          <img src={this.state.poster} alt="poster" className={styles.poster} />
          <div className={styles.details}>
            {this.state.title && (
              <h2
                className={styles.title}
                style={{ color: this.props.theme === "dark" ? "#FFF" : "" }}
              >
                {this.state.title}
              </h2>
            )}
            {this.state.type && (
              <p style={{ color: this.props.theme === "dark" ? "#FFF" : "" }}>
                <b>Type:</b> {this.state.type}
              </p>
            )}
            {this.state.plot && (
              <p style={{ color: this.props.theme === "dark" ? "#FFF" : "" }}>
                {this.state.plot.substring(0, this.state.breakPoint)}
                {!this.state.showMore && (
                  <span>
                    {this.state.plot.length > this.state.breakPoint && "..."}
                  </span>
                )}
                {!this.state.showMore && (
                  <span
                    className={styles.show}
                    onClick={() => this.setState({ showMore: true })}
                  >
                    {this.state.plot.length > this.state.breakPoint &&
                      "Show More"}
                  </span>
                )}
                {this.state.showMore && (
                  <span>
                    {this.state.plot.substring(
                      this.state.breakPoint,
                      this.state.plot.length
                    )}
                  </span>
                )}
                {this.state.showMore && (
                  <span
                    className={styles.show}
                    onClick={() => this.setState({ showMore: false })}
                  >
                    {this.state.plot.length > this.state.breakPoint &&
                      " Show less"}
                  </span>
                )}
              </p>
            )}
            {(this.state.episodeCount || this.state.chapterCount) && (
              <p style={{ color: this.props.theme === "dark" ? "#FFF" : "" }}>
                {this.state.episodeCount ? <b>Episodes:</b> : <b>Chapters:</b>}
                {" " + (this.state.episodeCount || this.state.chapterCount)}
              </p>
            )}
            {this.state.startDate && (
              <p style={{ color: this.props.theme === "dark" ? "#FFF" : "" }}>
                <b>Start Date:</b> {this.state.startDate}
              </p>
            )}
            <p style={{ color: this.props.theme === "dark" ? "#FFF" : "" }}>
              {this.state.endDate && (
                <span>
                  <b>End Date:</b> {this.state.endDate}
                </span>
              )}
            </p>
            {this.state.status && (
              <p style={{ color: this.props.theme === "dark" ? "#FFF" : "" }}>
                <b>Status:</b> {this.state.status}
              </p>
            )}
            {this.state.publisher && (
              <p style={{ color: this.props.theme === "dark" ? "#FFF" : "" }}>
                <b>Publisher:</b> {this.state.publisher}
              </p>
            )}
            {this.state.rating ? (
              <div className={styles.rating}>
                <Rating
                  precision={0.1}
                  value={this.state.rating}
                  max={10}
                  readOnly
                />
                <span
                  className={styles.ratingValue}
                  style={{ color: this.props.theme === "dark" ? "#FFF" : "" }}
                >
                  {this.state.rating}/10
                </span>
              </div>
            ) : (
              ""
            )}
            {this.state.addedToList ? (
              <div>
                <Button
                  variant={
                    this.props.theme === "dark" ? "contained" : "outlined"
                  }
                  color="primary"
                  className={styles.addToListButton}
                  onClick={() => this.handleOpen("edit")}
                  style={{
                    color: this.props.theme === "dark" ? "#FFF" : "",
                    borderColor: this.props.theme === "dark" ? "#FFF" : ""
                  }}
                >
                  Edit Status
                </Button>{" "}
                <Button
                  variant={
                    this.props.theme === "dark" ? "contained" : "outlined"
                  }
                  color="primary"
                  className={styles.addToListButton}
                  onClick={this.handleRemove}
                  style={{
                    color: this.props.theme === "dark" ? "#FFF" : "",
                    borderColor: this.props.theme === "dark" ? "#FFF" : ""
                  }}
                >
                  Remove From List
                </Button>
              </div>
            ) : (
              <Button
                variant={props.theme === "dark" ? "contained" : "outlined"}
                color="primary"
                className={styles.addToListButton}
                onClick={() => this.handleOpen("add")}
                style={{
                  color: this.props.theme === "dark" ? "#FFF" : "",
                  borderColor: this.props.theme === "dark" ? "#FFF" : ""
                }}
              >
                Add To List
              </Button>
            )}
            <AddToListPopup
              open={this.state.open}
              handleClose={this.handleClose}
              action="add"
              type={this.itemType}
              title={this.state.title}
              poster={this.state.poster}
              itemId={this.itemId}
              setMessage={this.setMessage}
              action={this.state.action}
            />
          </div>
        </div>
        {sessionStorage.username ? (
          <TextField
            id="outlined-secondary"
            placeholder="Write a Review"
            color="primary"
            variant="outlined"
            multiline={true}
            classes={{ root: styles.writeReview }}
            value={this.state.reviewInput}
            onChange={this.handleReviewInputChange}
            onKeyPress={this.handleKeyPress}
            InputProps={{
              className: this.props.theme === "dark" ? styles.white : ""
            }}
          />
        ) : (
          <h3
            className={styles.note}
            style={{ color: this.props.theme === "dark" ? "#FFF" : "" }}
          >
            To Write a Review, You have to Login
          </h3>
        )}
        {this.state.reviews.map((item, index) => (
          <Review
            key={index}
            author={item.author}
            content={item.content}
            likes={item.likes}
            liked={item.liked}
            reviewId={item.id}
            path={this.props.history.location.pathname}
            setMessage={this.setMessage}
            className={styles.review}
          />
        ))}

        {this.state.moreReviews && (
          <Button
            variant={this.props.theme === "dark" ? "contained" : "outlined"}
            color="primary"
            classes={{ root: styles.loadMore }}
            onClick={this.loadReviews}
            style={{
              color: this.props.theme === "dark" ? "#FFF" : "",
              borderColor: this.props.theme === "dark" ? "#FFF" : ""
            }}
          >
            Load More Reviews
          </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ItemDetails);
