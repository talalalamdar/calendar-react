import React, { Component } from 'react';

import Header from "./components/Header.js"
import Calendar from "./components/Calendar.js"
import DayDetails from "./components/DayDetails.js"

import moment from "moment"

class App extends Component {
  state = {
    day: moment().format("ddd, D MMM, YYYY"),
    agenda: {}
  }

  componentDidMount() {
    const { day } = this.state
    if (document.getElementById(day)) {
      document.getElementById(day).setAttribute("class", "selectedDay")
    }
  }

  componentWillMount() {
    const { day } = this.state
    if (localStorage.getItem("agenda")) {
      let savedAgenda = localStorage.getItem('agenda')
      let parsedObject = JSON.parse(savedAgenda)
      this.setState({
        agenda: parsedObject
      })
      return
    }
    this.setState({
      agenda: { [day]: [] }
    })
  }

  componentDidUpdate() {
    const { agenda, day } = this.state
    if (agenda[day]) {
      localStorage.setItem("agenda", JSON.stringify(agenda))
    }
  }

  onDayChange = (val) => {
    const { day } = this.state
    let selectedDay = document.getElementById(day)

    if (selectedDay) {
      selectedDay.classList.remove("selectedDay")
    }

    selectedDay = document.getElementById(moment(val).format("ddd, D MMM, YYYY"))
    if (selectedDay) {
      selectedDay.classList.remove("busy-days")
      selectedDay.setAttribute("class", "day-cell selectedDay")
    }
    this.setState({
      day: moment(val).format("ddd, D MMM, YYYY"),
    })
  }

  onAddingTask = (val) => {
    const { day, agenda } = this.state
    val['id'] = this.idGenerator()

    if (!agenda.hasOwnProperty(day)) {
      let newState = Object.assign(agenda, { [day]: [] })
      newState[day] = [...newState[day], val]
      this.setState({
        agenda: newState
      })
      return
    }

    this.setState({
      agenda: Object.assign(agenda, { [day]: [...agenda[day], val] })
    })
  }

  deleteTask = (taskId) => {
    const { day, agenda } = this.state
    let newState = agenda[day].filter(task => task.id !== taskId)
    this.setState({
      agenda: Object.assign(agenda, { [day]: newState })
    })
  }

  editTask = (taskId, newValue) => {
    const { day, agenda } = this.state
    let newState = agenda[day].map(task => {
      if (task.id === taskId) {
        task.title = newValue['title']
        task.location = newValue['location']
        task.time = newValue['time']
      }
      return task
    })
    this.setState({
      agenda: Object.assign(agenda, { [day]: newState })
    })
  }

  idGenerator = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  render() {
    const { day, agenda } = this.state
    console.log(agenda)
    return (
      <React.Fragment>
        <Header className="page-header" />
        <div className="main-container">
          <DayDetails selectedDay={day}
            agenda={this.state.agenda}
            addingTask={this.onAddingTask}
            deletingTask={this.deleteTask}
            editingTask={this.editTask} />
          <Calendar changeDate={this.onDayChange}
            agenda={agenda}
            selectedDay={day} />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
