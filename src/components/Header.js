import React, { Component } from "react"

import { FaCalendarAlt } from "react-icons/fa"

class Header extends Component {

  render() {
    return (
      <header className="App-header">
        <h1 className="App-title"> <strong> Calendar </strong> <FaCalendarAlt className="calendar-icon" /></h1>
      </header>
    );
  }
}


export default Header;