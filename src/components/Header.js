import React, { Component } from "react"

import FaCalendar from "react-icons/lib/fa/calendar"


class Header extends Component {

  render() {
    return (
      <header className="App-header">
        <h1 className="App-title"> <strong> Calendar </strong> <FaCalendar className="calendar-icon" /></h1>
      </header>
    );
  }
}


export default Header;