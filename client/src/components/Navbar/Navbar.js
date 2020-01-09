import React, { Component } from "react";
import { connect } from "react-redux";
import {
  AppBar,
  Toolbar,
  Button,
  InputBase,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem
} from "@material-ui/core";
import { setTheme } from "../../actions";
import SearchIcon from "@material-ui/icons/Search";
import MoreIcon from "@material-ui/icons/MoreVert";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss";

const mapStateToProps = state => ({
  theme: state.theme
});
const mapDispatchToProps = dispatch => ({
  dispatch
});

class Navbar extends Component {
  state = { anchorEl: null, drawerOpen: false, loggedIn: false };
  openMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };
  openDrawer = () => {
    this.setState({ drawerOpen: true });
  };
  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  handleDrawerClose = () => {
    this.setState({ drawerOpen: false });
  };
  logout = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/auth/logout`)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        sessionStorage.setItem("username", "");
        document.location.reload();
      })
      .catch(err => console.log(err));
  };
  setTheme = () => {
    let nextTheme = this.props.theme === "light" ? "dark" : "light";
    this.props
      .dispatch(setTheme(nextTheme))
      .then(() => localStorage.setItem("theme", nextTheme));
  };
  componentDidMount() {
    if (sessionStorage.username) this.setState({ loggedIn: true });
  }
  render() {
    return (
      <AppBar position="fixed" classes={{ root: styles.rightPadding }}>
        <Toolbar
          classes={{ root: styles.Navbar }}
          style={{
            backgroundColor: this.props.theme === "dark" ? "#1F1F1F" : "#25476a"
          }}
        >
          <IconButton onClick={this.openDrawer} className={styles.drawerIcon}>
            <MenuIcon />
          </IconButton>
          <Drawer
            open={this.state.drawerOpen}
            onClose={this.handleDrawerClose}
            classes={{
              paper: this.props.theme === "dark" ? styles.dark : styles.light
            }}
          >
            <List classes={{ root: styles.drawerList }}>
              <ListItem button>
                <Link
                  to="/anime"
                  className={styles.drawerLink}
                  style={{
                    color: this.props.theme === "dark" ? "#FFF" : "#000"
                  }}
                >
                  Anime
                </Link>
              </ListItem>
              <ListItem button>
                <Link
                  to="/manga"
                  className={styles.drawerLink}
                  style={{
                    color: this.props.theme === "dark" ? "#FFF" : "#000"
                  }}
                >
                  Manga
                </Link>
              </ListItem>
            </List>
          </Drawer>
          <div className={styles.desktopNav}>
            <Button color="inherit" className={styles.btn}>
              <Link to="/anime" className={styles.link}>
                Anime
              </Link>
            </Button>
            <Button color="inherit" className={styles.btn}>
              <Link to="/manga" className={styles.link}>
                Manga
              </Link>
            </Button>
          </div>
          {this.props.showSearch && (
            <div
              className={styles.search}
              style={{
                backgroundColor:
                  this.props.theme === "dark" ? "#333" : "#456280"
              }}
            >
              <div className={styles.searchIcon}>
                <SearchIcon />
              </div>
              <form onSubmit={this.props.search}>
                <InputBase
                  placeholder="Search…"
                  value={this.props.searchValue}
                  onChange={this.props.searchChange}
                  classes={{
                    root: styles.searchRoot,
                    input: styles.searchInput
                  }}
                />
              </form>
            </div>
          )}
          <IconButton onClick={this.openMenu} className={styles.moreIcon}>
            <MoreIcon />
          </IconButton>
          <Menu
            anchorEl={this.state.anchorEl}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            keepMounted
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem
              style={{
                padding: "10px",
                backgroundColor:
                  this.props.theme === "dark" ? "#1f1f1f" : "#fff"
              }}
            >
              {this.state.loggedIn ? (
                <Link
                  to={`/profile/${sessionStorage.username}`}
                  className={styles.menuLink}
                  style={{
                    color: this.props.theme === "dark" ? "#FFF" : "#000"
                  }}
                >
                  Profile
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className={styles.menuLink}
                  style={{
                    color: this.props.theme === "dark" ? "#FFF" : "#000"
                  }}
                >
                  Signup
                </Link>
              )}
            </MenuItem>
            <MenuItem
              style={{
                padding: "10px",
                backgroundColor:
                  this.props.theme === "dark" ? "#1f1f1f" : "#fff"
              }}
            >
              {this.state.loggedIn ? (
                <div
                  style={{
                    color: this.props.theme === "dark" ? "#FFF" : "#000"
                  }}
                  onClick={this.logout}
                >
                  Logout
                </div>
              ) : (
                <Link
                  to="/login"
                  className={styles.menuLink}
                  style={{
                    color: this.props.theme === "dark" ? "#FFF" : "#000"
                  }}
                >
                  Login
                </Link>
              )}
            </MenuItem>
            <MenuItem
              style={{
                padding: "10px",
                color: this.props.theme === "dark" ? "#FFF" : "#000",
                backgroundColor:
                  this.props.theme === "dark" ? "#1f1f1f" : "#fff"
              }}
              onClick={this.setTheme}
            >
              {this.props.theme === "light" ? "Dark Theme" : "Light Theme"}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
