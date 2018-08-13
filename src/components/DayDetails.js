import React, { Component } from "react"
import TaskItem from "./TaskItem"

import moment from "moment"
import FaPlus from "react-icons/lib/fa/plus"

const defaultState = {
    title: "",
    time: moment().format("HH:mm"),
    location: "",
    repeatWeekly: false,
    repeatMonthly: false
}

class DayDetails extends Component {
    state = defaultState

    handleChange = (val, field) => {
        if (field === "time") {
            this.setState({
                time: moment(val, "HH:mm").format("HH:mm")
            })
        }
        this.setState({
            [field]: val
        })
    }

    handleCheckboxChange = (field) => {
        this.setState({
            [field]: !this.state[field]
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
        const { title, location, time, repeatWeekly, repeatMonthly } = this.state
        return (
            <form className="well" onSubmit={e => this.handleSubmit(e)}>
                <input type="text" className="span2" onChange={e => this.handleChange(e.target.value, "title")} placeholder="Add a title" value={title} />
                <input className="span2" onChange={e => this.handleChange(e.target.value, "location")} placeholder="Add a location" value={location} />
                <input type="time" className="input-smal" onChange={e => this.handleChange(e.target.value, "time")} value={time} />
                <div className="form-group">
                    <input type="checkbox" onChange={() => this.handleCheckboxChange("repeatWeekly")} checked={repeatWeekly} /> Repeat weekly <br />
                    <input type="checkbox" onChange={() => this.handleCheckboxChange("repeatMonthly")} checked={repeatMonthly} /> Repeat monthly <br />
                </div>
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
                    repeatWeekly={task.repeatWeekly}
                    repeatMonthly={task.repeatMonthly}
                    onDelete={this.onDeleteTask}
                    onEdit={this.onEditTask} />
            )
        }

        return (
            <div className="side-bar" >
                <h2 className="day-header"><strong>{moment(selectedDay, "ddd, D MMM, YYYY").format("ddd, D MMM, YYYY")}</strong></h2>
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