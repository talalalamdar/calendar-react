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
    let selectedDay = moment(val).format("ddd, D MMM, YYYY")
 
    this.setState({
      day: selectedDay,
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

  deleteAllTasks = () => {
    this.setState({
      agenda: {}
    })
    localStorage.setItem("agenda", JSON.stringify({}))
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

  idGenerator = () => {                                         // to generate unique id's for each task
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  render() {
    const { day, agenda } = this.state

    return (
      <React.Fragment>
        <Header className="page-header" />
        <div className="main-container">
          <Calendar changeDate={this.onDayChange}
            agenda={agenda}
            selectedDay={day}
            deleteAll={this.deleteAllTasks} />
          <DayDetails selectedDay={day}
            agenda={agenda}
            addingTask={this.onAddingTask}
            deletingTask={this.deleteTask}
            editingTask={this.editTask} />
        </div>
        <div style={styles.authorDiv}>
          by <a style={{color: 'gray'}} href='https://talalalamdar.surge.sh' target='__blank'>Talal Alamdar</a>
        </div>
      </React.Fragment>
    );
  }
}

const styles = {
  authorDiv: {
    position: 'fixed',
    bottom: '10px',
    left: '10px',
    zIndex: 0,
    color: 'gray'
  }
}

export default App;
