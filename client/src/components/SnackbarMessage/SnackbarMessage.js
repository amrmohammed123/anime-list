import React from "react";
import { SnackbarContent, IconButton } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import styles from "./SnackbarMessage.module.scss";

const SnackbarMessage = ({
  success = false,
  message = "",
  close = () => {}
}) => {
  return (
    <SnackbarContent
      className={success ? styles.successMessage : styles.errorMessage}
      message={
        <span
          className={
            success ? styles.successMessageContent : styles.errorMessageContent
          }
        >
          {success ? (
            <CheckCircleIcon className={styles.successIcon} />
          ) : (
            <ErrorIcon className={styles.errorIcon} />
          )}
          {message}
        </span>
      }
      action={[
        <IconButton key="close" color="inherit" onClick={close}>
          <CloseIcon />
        </IconButton>
      ]}
    />
  );
};

export default SnackbarMessage;
