import React, { Component } from "react";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  removeFromUserAnimeList,
  removeFromUserMangaList
} from "../../actions";
import AddToListPopup from "../AddToListPopup";
import styles from "./Card.module.scss";

const mapStateToProps = state => ({
  userAnimeList: state.userAnimeList,
  userMangaList: state.userMangaList,
  theme: state.theme
});
const mapDispatchToProps = dispatch => ({
  dispatch
});
class Card extends Component {
  state = { open: false, action: "add", addedToList: false };
  CardClassNames = [styles.Card, this.props.className].join(" ");

  // redirect to itemDetails page
  showDetails = () => {
    this.props.history.push(`/${this.props.itemType}/${this.props.itemId}`);
  };
  // open add to list pop up
  handleOpen = (event, action) => {
    event.stopPropagation();
    if (!sessionStorage.username) this.props.history.push("/login");
    else {
      this.setState({ open: true });
      this.setState({ action });
    }
  };
  handleRemove = event => {
    event.stopPropagation();
    fetch(`${process.env.REACT_APP_SERVER_URL}/user/list`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({
        id: this.props.itemId,
        type: this.props.itemType,
        action: "delete"
      })
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        // add to redux store
        if (this.props.itemType === "anime") {
          this.props
            .dispatch(removeFromUserAnimeList(this.props.itemId))
            .then(() => {
              this.setState({ addedToList: false }, () => {
                this.props.setMessage("item removed from your list", true);
              });
            });
        } else {
          this.props
            .dispatch(removeFromUserMangaList(this.props.itemId))
            .then(() => {
              this.setState({ addedToList: false }, () => {
                this.props.setMessage("item removed from your list", true);
              });
            });
        }
      })
      .catch(error => {
        this.props.setMessage(`Couldn't remove item`, false);
      });
  };
  // close add to list pop up
  handleClose = () => {
    this.setState({ open: false });
  };
  componentDidUpdate() {
    // determine whether current item is already added to user lists
    if (!this.state.addedToList) {
      if (this.props.itemType === "anime") {
        for (let i = 0; i < this.props.userAnimeList.length; i++) {
          if (this.props.userAnimeList[i].id === this.props.itemId) {
            this.setState({ addedToList: true });
            break;
          }
        }
      } else {
        for (let i = 0; i < this.props.userMangaList.length; i++) {
          if (this.props.userMangaList[i].id === this.props.itemId) {
            this.setState({ addedToList: true });
            break;
          }
        }
      }
    }
  }
  componentDidMount() {
    // determine whether current card is already added to user lists
    if (this.props.itemType === "anime") {
      for (let i = 0; i < this.props.userAnimeList.length; i++) {
        if (this.props.userAnimeList[i].id === this.props.itemId) {
          this.setState({ addedToList: true });
          break;
        }
      }
    } else {
      for (let i = 0; i < this.props.userMangaList.length; i++) {
        if (this.props.userMangaList[i].id === this.props.itemId) {
          this.setState({ addedToList: true });
          break;
        }
      }
    }
  }
  render() {
    return (
      <div className={this.CardClassNames}>
        <div className={styles.Card_poster}>
          <img src={this.props.poster} alt="poster" className={styles.image} />
          <div className={styles.overlay} onClick={this.showDetails}>
            <div className={styles.Card_actions}>
              <Button classes={{ root: styles.btn, label: styles.white }}>
                Show Details
              </Button>
              {this.state.addedToList ? (
                <div>
                  <Button
                    classes={{ root: styles.btn, label: styles.white }}
                    onClick={event => this.handleOpen(event, "edit")}
                  >
                    Edit Status
                  </Button>{" "}
                  <Button
                    classes={{ root: styles.btn, label: styles.white }}
                    onClick={this.handleRemove}
                    className={styles.redBackground}
                  >
                    Remove From List
                  </Button>
                </div>
              ) : (
                <Button
                  classes={{ root: styles.btn, label: styles.white }}
                  onClick={event => this.handleOpen(event, "add")}
                >
                  Add To List
                </Button>
              )}
            </div>
          </div>
        </div>
        <Link
          to={`/${this.props.itemType}/${this.props.itemId}`}
          className={styles.Card_title}
          style={{ color: this.props.theme === "light" ? "#000" : "#FFF" }}
        >
          {this.props.title}
        </Link>
        <AddToListPopup
          open={this.state.open}
          handleClose={this.handleClose}
          action={this.state.action}
          type={this.props.itemType}
          title={this.props.title}
          poster={this.props.poster}
          itemId={this.props.itemId}
          setMessage={this.props.setMessage}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Card);
