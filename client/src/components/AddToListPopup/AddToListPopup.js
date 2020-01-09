import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  RadioGroup,
  Radio,
  FormControlLabel
} from "@material-ui/core";
import {
  pushToUserAnimeList,
  pushToUserMangaList,
  editUserAnimeListStatus,
  editUserMangaListStatus
} from "../../actions";
import { connect } from "react-redux";
import styles from "./AddToListPopup.module.scss";

const mapStateToProps = state => ({
  theme: state.theme
});
const mapDispatchToProps = dispatch => ({
  dispatch
});

const AddToListPopup = ({
  action = "add",
  type = "anime",
  title = "",
  poster = "",
  itemId = "",
  open = false,
  handleClose = null,
  setMessage = null,
  ...props
}) => {
  const [status, setStatus] = useState("");
  const handleAction = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/user/list`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ itemId, poster, type, status, title, action })
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        // add to redux store
        if (type === "anime") {
          props
            .dispatch(
              action === "add"
                ? pushToUserAnimeList({ id: itemId, poster, status, title })
                : editUserAnimeListStatus(itemId, status)
            )
            .then(() => {
              handleClose();
              setMessage(
                action === "add"
                  ? "item added to your list"
                  : "item edited successfully",
                true
              );
            });
        } else {
          props
            .dispatch(
              action === "add"
                ? pushToUserMangaList({ id: itemId, poster, status, title })
                : editUserMangaListStatus(itemId, status)
            )
            .then(() => {
              handleClose();
              setMessage(
                action === "add"
                  ? "item added to your list"
                  : "item edited successfully",
                true
              );
            });
        }
      })
      .catch(error => {
        handleClose();
        setMessage(`Couldn't ${action} item`, false);
      });
  };
  const handleChange = event => setStatus(event.target.value);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      classes={{ paper: props.theme === "dark" ? styles.dark : "" }}
    >
      <DialogTitle style={{ color: props.theme === "dark" ? "#fff" : "" }}>
        Choose Status
      </DialogTitle>
      <DialogContent>
        <RadioGroup value={status} onChange={handleChange}>
          <FormControlLabel
            className={styles.radio}
            value={type === "anime" ? "Plan To Watch" : "Plan To Read"}
            control={
              <Radio
                color="primary"
                style={{ color: props.theme === "dark" ? "#fff" : "" }}
              />
            }
            label={type === "anime" ? "Plan To Watch" : "Plan To Read"}
            style={{ color: props.theme === "dark" ? "#fff" : "" }}
          />
          <FormControlLabel
            className={styles.radio}
            value={type === "anime" ? "Watching" : "Reading"}
            control={
              <Radio
                color="primary"
                style={{ color: props.theme === "dark" ? "#fff" : "" }}
              />
            }
            label={type === "anime" ? "Watching" : "Reading"}
            style={{ color: props.theme === "dark" ? "#fff" : "" }}
          />
          <FormControlLabel
            className={styles.radio}
            value="Finished"
            control={
              <Radio
                color="primary"
                style={{ color: props.theme === "dark" ? "#fff" : "" }}
              />
            }
            label="Finished"
            style={{ color: props.theme === "dark" ? "#fff" : "" }}
          />
          <FormControlLabel
            className={styles.radio}
            value="Dropped"
            control={
              <Radio
                color="primary"
                style={{ color: props.theme === "dark" ? "#fff" : "" }}
              />
            }
            label="Dropped"
            style={{ color: props.theme === "dark" ? "#fff" : "" }}
          />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleAction}
          variant={props.theme === "dark" ? "contained" : "outlined"}
          fullWidth={true}
          color="primary"
          autoFocus
        >
          {action}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToListPopup);
