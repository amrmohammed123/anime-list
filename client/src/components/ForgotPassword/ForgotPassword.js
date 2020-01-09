import React, { Component } from "react";
import { connect } from "react-redux";
import {
  TextField,
  Container,
  Button,
  CircularProgress
} from "@material-ui/core";
import SnackbarMessage from "../SnackbarMessage";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import styles from "./ForgotPassword.module.scss";

const mapStateToProps = state => ({
  theme: state.theme
});

class ForgotPassword extends Component {
  state = { email: "", errorMessage: "", showCircularProgress: false };
  handleChange = e => {
    this.setState({ email: e.target.value });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.setState({ showCircularProgress: true }, () => {
      fetch(`${process.env.REACT_APP_SERVER_URL}/password/forgot`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ email: this.state.email })
      })
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          this.setState({
            errorMessage: "",
            successMessage: "Email Sent Successfully",
            showCircularProgress: false
          });
        })
        .catch(error => {
          this.setState({
            errorMessage: "Couldn't send email",
            successMessage: "",
            showCircularProgress: false
          });
        });
    });
  };
  closeMessage = () => {
    this.setState({ errorMessage: "", successMessage: "" });
  };
  goBack = () => {
    this.props.history.push("/login");
  };
  render() {
    return (
      <>
        {this.state.showCircularProgress && (
          <div
            className={styles.loaderContainer}
            style={{
              height: `${window.innerHeight}px`,
              width: `${window.innerWidth}px`
            }}
          >
            <CircularProgress className={styles.loader} />
          </div>
        )}
        <Container className={styles.ForgotPassword}>
          <h3 style={{ color: this.props.theme === "dark" ? "#fff" : "" }}>
            We will send you an Email to reset your password, please enter your
            Email below.
          </h3>
          <form onSubmit={this.handleSubmit}>
            <TextField
              variant="outlined"
              className={styles.forgotPasswordInput}
              required
              fullWidth={true}
              placeholder="Enter Email"
              type="email"
              onChange={this.handleChange}
              value={this.state.email}
              inputProps={{
                className: this.props.theme === "dark" ? styles.white : ""
              }}
            />
            <div className={styles.buttons}>
              <Button
                variant={this.props.theme === "dark" ? "contained" : "outlined"}
                color="primary"
                type="submit"
                size="large"
                className={styles.forgotPasswordButton}
                onClick={this.goBack}
              >
                <ChevronLeftIcon /> Back
              </Button>
              <Button
                variant={this.props.theme === "dark" ? "contained" : "outlined"}
                color="primary"
                type="submit"
                size="large"
                className={styles.forgotPasswordButton}
              >
                Send Email
              </Button>
            </div>
          </form>
          {this.state.errorMessage && (
            <SnackbarMessage
              success={false}
              message={this.state.errorMessage}
              close={this.closeMessage}
            />
          )}
          {this.state.successMessage && (
            <SnackbarMessage
              success={true}
              message={this.state.successMessage}
              close={this.closeMessage}
            />
          )}
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps, null)(ForgotPassword);
