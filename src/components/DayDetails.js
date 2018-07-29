import React, { Component } from "react"
import TaskItem from "./TaskItem"

import moment from "moment"
import FaPlus from "react-icons/lib/fa/plus"

const defaultState = {
    title: "",
    time: moment().hour() + ":" + moment().minute(),
    location: "",
}

class DayDetails extends Component {
    state = {
        title: "",
        time: moment().hour() + ":" + moment().minute(),
        location: "",
    }

    onTitleChange = (title) => {
        this.setState({
            title
        })
    }

    onTimeChange = (val) => {
        this.setState({
            time: val
        })
    }

    onDescriptionChange = (location) => {
        this.setState({
            location
        })
    }

    handleSubmit = (e) => {
        const { title, time, location } = this.state
        if (title && time && location) {
            e.preventDefault()
            this.props.addingTask(this.state)
            this.setState(defaultState)
        }
        e.preventDefault()
    }

    onDeleteTask = (taskId) => {
       this.props.deletingTask(taskId)
    }

    onEditTask = (taskId, newVal) => {
        this.props.editingTask(taskId, newVal)
    }

    formDisplay = () => {
        return (
            <form class="well" onSubmit={e => this.handleSubmit(e)}>
                <input type="text" className="span3" onChange={e => this.onTitleChange(e.target.value)} placeholder="Add a title" value={this.state.title} />
                <input class="span3" onChange={e => this.onDescriptionChange(e.target.value)} placeholder="Add a location" value={this.state.location} />
                <input type="time" className="input-smal" onChange={e => this.onTimeChange(e.target.value)} value={this.state.time} />
                <button type="submit" className="btn btn-success"> <FaPlus /> Add new event</button>
            </form>
        )
    }

    render() {
        const { agenda, selectedDay } = this.props

        let tasks = []
        if (agenda[selectedDay]) {
            tasks = agenda[selectedDay].map(task =>
                <TaskItem key={task.id}
                          id={task.id}
                          title={task.title}
                          time={task.time}
                          location={task.location}
                          onDelete={this.onDeleteTask}
                          onEdit={this.onEditTask} />
            )
    }

    return(
            <div className = "side-bar" >
                <h2 className="day-header"><strong>{moment(selectedDay).format("ddd, D MMM, YYYY")}</strong></h2>
                 <div>
                    {this.formDisplay()}
                </div>
                 <p>You have {tasks.length ? tasks.length + " meetings in total. Your agenda:" : "no meetings."} </p>
                  {tasks}
            </div>
        )
    }
}

export default DayDetails;