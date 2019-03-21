import React, { Component } from "react"
import TaskItem from "./TaskItem"

import moment from "moment"
import { FaPlus } from "react-icons/fa"
import { Form, Col, Button, Row } from 'react-bootstrap'

const defaultState = {
    title: "",
    time: moment().format("HH:mm"),
    location: "",
    repeatWeekly: false,
    repeatMonthly: false,
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
        e.preventDefault()
        const { title, time, location } = this.state
        if (title && time && location) {
            this.props.addingTask(this.state)
            this.setState(defaultState)

        }
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
            <Form style={styles.formStyle}
                onSubmit={e => this.handleSubmit(e)}>
                <Row >
                    <Col sm={6} md={5} style={styles.formInput}>
                        <Form.Control type="text" onChange={e => this.handleChange(e.target.value, "title")} placeholder="Add a title" value={title} required />
                    </Col>
                    <Col sm={6} md={5} style={styles.formInput}>
                        <Form.Control onChange={e => this.handleChange(e.target.value, "location")} placeholder="Add a location" value={location} required />
                    </Col>
                </Row>
                <Row >
                    <Col sm={4} md={4} style={styles.formInput}>
                        <Form.Control type="time" onChange={e => this.handleChange(e.target.value, "time")} value={time} />
                    </Col>
                    <Col sm={4} md={4} style={styles.formInput}>
                        <Form.Group>
                            <input type="checkbox" onChange={() => this.handleCheckboxChange("repeatWeekly")} checked={repeatWeekly} /> Repeat weekly <br />
                            <input type="checkbox" onChange={() => this.handleCheckboxChange("repeatMonthly")} checked={repeatMonthly} /> Repeat monthly <br />
                        </Form.Group>
                    </Col>
                </Row>
                <Row >
                    <Col sm={3} md={4} style={styles.btnDiv}>
                        <button style={styles.newTaskBtn} type="submit" className="submit-btn"> <FaPlus /></button>
                    </Col>
                </Row>
            </Form>
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
                <p style={{fontSize: '18px', fontWeight: 200}}>You have {tasks.length ? tasks.length + " meetings in total in this day. Your agenda:" : "no meetings."} </p>
                <div style={styles.tasksWrapper}>
                    {tasks}
                </div>
            </div>
        )
    }
}

const styles = {
    formInput: {
        marginBottom: '20px'
    },
    tasksWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
    },
    formStyle: {backgroundColor: 'rgb(240, 238, 238)', padding: 20, marginBottom: 20, borderRadius: '4px'},
    newTaskBtn: {
        borderRadius: '50%',
        padding: '15px' ,
        fontSize: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnDiv: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    }
}

export default DayDetails;