import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, TextField, Button } from "@material-ui/core";
import SnackbarMessage from "../SnackbarMessage";
import styles from "./Signup.module.scss";

const mapStateToProps = state => ({
  theme: state.theme
});

class Signup extends Component {
  state = {
    errorMessage: "",
    username: "",
    password: "",
    verifyPassword: "",
    email: ""
  };
  closeErrorMessage = () => {
    this.setState({ errorMessage: "" });
  };
  handleEvent = event => {
    switch (event.type) {
      case "submit":
        event.preventDefault();
        if (this.state.password == this.state.verifyPassword) {
          fetch(`${process.env.REACT_APP_SERVER_URL}/auth/signup`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
              username: this.state.username.toLowerCase(),
              password: this.state.password,
              email: this.state.email
            })
          })
            .then(response => {
              if (!response.ok) {
                throw Error(response.statusText);
              }
              return response.json();
            })
            .then(response => {
              if (response.error) {
                this.setState({ errorMessage: response.error });
              } else {
                sessionStorage.setItem("username", response.username);
                this.props.history.push("/anime");
              }
            })
            .catch(err => {
              if (err) {
                this.setState({
                  errorMessage: "Couldn't signup"
                });
              }
            });
        } else {
          this.setState({
            errorMessage: "passwords don't match"
          });
        }
        break;
      case "change":
        if (event.target.placeholder === "Rewrite Password") {
          this.setState({
            verifyPassword: event.target.value
          });
        } else {
          this.setState({
            [event.target.placeholder.toLowerCase()]: event.target.value
          });
        }
        break;
    }
  };
  render() {
    if (sessionStorage.username) this.props.history.push("/anime");
    return (
      <Container className={styles.Signup}>
        <form onSubmit={this.handleEvent}>
          <TextField
            variant="outlined"
            className={styles.signupInput}
            required
            fullWidth={true}
            placeholder="Username"
            inputProps={{
              maxLength: 10,
              className: this.props.theme === "dark" ? styles.white : ""
            }}
            onChange={this.handleEvent}
          />
          <TextField
            variant="outlined"
            className={styles.signupInput}
            required
            fullWidth={true}
            placeholder="Password"
            type="password"
            inputProps={{
              className: this.props.theme === "dark" ? styles.white : ""
            }}
            onChange={this.handleEvent}
          />
          <TextField
            variant="outlined"
            className={styles.signupInput}
            required
            fullWidth={true}
            placeholder="Rewrite Password"
            type="password"
            inputProps={{
              className: this.props.theme === "dark" ? styles.white : ""
            }}
            onChange={this.handleEvent}
          />
          <TextField
            variant="outlined"
            className={styles.signupInput}
            required
            fullWidth={true}
            placeholder="Email"
            type="email"
            inputProps={{
              className: this.props.theme === "dark" ? styles.white : ""
            }}
            onChange={this.handleEvent}
          />
          <Button
            fullWidth={true}
            variant={this.props.theme === "dark" ? "contained" : "outlined"}
            color="primary"
            type="submit"
            size="large"
            className={styles.signupButton}
            type="submit"
            style={{
              color: this.props.theme === "dark" ? "#FFF" : "",
              borderColor: this.props.theme === "dark" ? "#FFF" : ""
            }}
          >
            Signup
          </Button>
        </form>
        {this.state.errorMessage && (
          <SnackbarMessage
            message={this.state.errorMessage}
            success={false}
            close={this.closeErrorMessage}
          />
        )}
      </Container>
    );
  }
}

export default connect(mapStateToProps, null)(Signup);
