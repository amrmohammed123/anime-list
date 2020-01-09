import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { Link } from "react-router-dom";
import styles from "./Review.module.scss";

const mapStateToProps = state => ({
  theme: state.theme
});

class Review extends Component {
  state = { likes: this.props.likes, liked: this.props.liked };
  ReviewClassNames = [styles.Review, this.props.className].join(" ");
  handleLike = () => {
    this.setState(
      {
        likes: this.state.liked ? this.state.likes - 1 : this.state.likes + 1,
        liked: !this.state.liked
      },
      () => {
        // add the like/unlike on the server
        fetch(`${process.env.REACT_APP_SERVER_URL}/item/reviews/like`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            path: this.props.path,
            id: this.props.reviewId
          })
        })
          .then(response => {
            if (!response.ok) {
              throw Error(response.statusText);
            }
          })
          .catch(err => {
            this.props.setMessage("Couldn't Save Your Action", false);
          });
      }
    );
  };
  render() {
    return (
      <div className={this.ReviewClassNames}>
        <h3 className={styles.author}>
          <Link
            to={`/profile/${this.props.author}`}
            style={{ color: this.props.theme === "dark" ? "#FFF" : "" }}
          >
            {this.props.author}
          </Link>
        </h3>
        <pre
          className={styles.content}
          style={{ color: this.props.theme === "dark" ? "#FFF" : "" }}
        >
          {this.props.content}
        </pre>
        <p className={styles.likes}>
          <ThumbUpAltIcon className={styles.likeIcon} />{" "}
          <span style={{ color: this.props.theme === "dark" ? "#FFF" : "" }}>
            {this.state.likes}
          </span>
        </p>
        {sessionStorage.username &&
          sessionStorage.username !== this.props.author && (
            <Button
              variant="contained"
              color="primary"
              className={styles.likeButton}
              onClick={this.handleLike}
            >
              {this.state.liked ? "unlike" : "like"}
            </Button>
          )}
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(Review);
