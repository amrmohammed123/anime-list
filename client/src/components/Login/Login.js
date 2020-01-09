import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, TextField, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import SnackbarMessage from "../SnackbarMessage";
import styles from "./Login.module.scss";

const mapStateToProps = state => ({
  theme: state.theme
});

class Login extends Component {
  state = {
    errorMessage: "",
    username: "",
    password: ""
  };
  closeErrorMessage = () => {
    this.setState({ errorMessage: "" });
  };
  handleEvent = event => {
    switch (event.type) {
      case "submit":
        event.preventDefault();
        fetch(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            username: this.state.username.toLowerCase(),
            password: this.state.password
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
                errorMessage: "Couldn't login"
              });
            }
          });

        break;
      case "change":
        this.setState({
          [event.target.placeholder.toLowerCase()]: event.target.value
        });
        break;
    }
  };
  render() {
    if (sessionStorage.username) this.props.history.push("/anime");
    return (
      <Container className={styles.Login}>
        <form onSubmit={this.handleEvent}>
          <TextField
            variant="outlined"
            className={styles.loginInput}
            required
            fullWidth={true}
            placeholder="Username"
            inputProps={{
              className: this.props.theme === "dark" ? styles.white : ""
            }}
            onChange={this.handleEvent}
          />
          <TextField
            variant="outlined"
            className={styles.loginInput}
            required
            fullWidth={true}
            placeholder="Password"
            type="password"
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
            className={styles.loginButton}
            type="submit"
          >
            Login
          </Button>
        </form>
        <div className={styles.moreOptions}>
          <p
            className={styles.text}
            style={{ color: this.props.theme === "dark" ? "#fff" : "" }}
          >
            No Account?{" "}
            <Link to="/signup" className={styles.link}>
              Signup
            </Link>
          </p>
          <p
            className={styles.text}
            style={{ color: this.props.theme === "dark" ? "#fff" : "" }}
          >
            Forgot Your Password?{" "}
            <Link to="/forgotPassword" className={styles.link}>
              Click Here
            </Link>
          </p>
        </div>
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

export default connect(mapStateToProps, null)(Login);
