import React, { Component } from "react";
import { HashRouter } from "react-router-dom";
import { connect } from "react-redux";

import * as creators from "./store/actions/index";
import Login from "./components/Login/Login";
import Router from "./routes/Router";

class App extends Component {
  state = {
    err: "",
  };

  async componentDidMount() {
    await this.props.get_me(() => {
      this.setState({ err: "You are not login!" });
    });
  }

  render() {
    return (
      <HashRouter basename="/">
        <Router />
      </HashRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    me: state.me,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    get_me: (err) => dispatch(creators.get_me(err)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
