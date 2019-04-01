import React, { Component } from "react"

import { FaEdit, FaRegCheckSquare, FaRegWindowClose } from "react-icons/fa"

import moment from "moment"

import { Form , Col} from 'react-bootstrap'

class TaskItem extends Component {
    state = {
        toggleDelete: false,
        toggleEdit: false,
        editedTitle: this.props.title,
        editedLocation: this.props.location,
        editedTime: this.props.time
    }

    activateDeleteMode = () => {
        this.setState({
            toggleDelete: true
        })
    }

    activateEditMode = () => {
        this.setState({
            toggleEdit: true
        })
    }

    handleDelete = (id) => {
        this.props.onDelete(id)
    }

    handleEdit = (id) => {
        const { editedLocation, editedTime, editedTitle } = this.state
        let timeStr = moment(editedTime, "HH:mm").format("HH:mm")
        this.props.onEdit(id, { title: editedTitle, location: editedLocation, time: timeStr })
        this.cancelSelectedMode()
    }

    onEditingTitle = (val) => {
        this.setState({
            editedTitle: val
        })
    }

    onEditingLocation = (val) => {
        this.setState({
            editedLocation: val
        })
    }

    onEditingTime = (val) => {
        this.setState({
            editedTime: val
        })
    }

    cancelSelectedMode = () => {
        this.setState({
            toggleDelete: false,
            toggleEdit: false,
            editedTitle: this.props.title,
            editedLocation: this.props.location,
            editedTime: this.props.time
        })
    }

    deleteModal = () => {
        const { id, title } = this.props

        return (
            <div className="task-item">
                <li>
                    <p style={{ fontSize: '18px', fontWight: 200 }}>Are you sure you want to delete <strong>{title}</strong> ?</p>
                    <div className="confirm-btn" onClick={() => this.handleDelete(id)}  title='Confirm'>
                        <FaRegCheckSquare  />
                    </div>
                    <div className='close-remove' title="Cancel"  onClick={this.cancelSelectedMode}>
                        <FaRegWindowClose>&times;</FaRegWindowClose>
                    </div>
                </li>
            </div>
        )
    }

    editModal = () => {
        const { id } = this.props
        return (
            <div className="task-item">
                <div className="selected-item">
                    <Col  className="form-row" md={8}>
                        <Form.Control type="text" className="span1" onChange={e => this.onEditingTitle(e.target.value)} value={this.state.editedTitle} required />
                    </Col>
                    <Col  className="form-row" md={8}>
                        at <Form.Control type="time" onChange={e => this.onEditingTime(e.target.value)} value={this.state.editedTime} required />
                    </Col>
                    <Col  className="form-row" md={8}>
                        In <Form.Control type="text" className="span1" onChange={e => this.onEditingLocation(e.target.value)} value={this.state.editedLocation} required />
                    </Col>
                    <div className="confirm-btn" onClick={() => this.handleEdit(id)} title='Update'>
                        <FaRegCheckSquare  />
                    </div>
                    <div className="close-remove" onClick={this.cancelSelectedMode} title='Cancel'>
                        <FaRegWindowClose >&times;</FaRegWindowClose>
                    </div>
                </div>
            </div>

        )
    }

    render() {
        const { title, location, time, repeatWeekly, repeatMonthly } = this.props

        if (this.state.toggleDelete) {
            return this.deleteModal()
        }
        if (this.state.toggleEdit) {
            return this.editModal()
        }

        return (
            <div className="task-item">
                <li> <strong> {title} </strong> at <strong> {time} </strong> <br />
                    In <strong> {location}</strong> <br />
                    <button className="close" title='Delete' onClick={this.activateDeleteMode}>&times;</button>
                    <div onClick={this.activateEditMode} className="edit-btn" title='Edit'>
                        <FaEdit  />
                    </div>
                    {repeatWeekly ? "Repeat weekly" : ""} <br />
                    {repeatMonthly ? "Repeat monthly" : ""}
                </li>
            </div>
        )
    }
}

export default TaskItem;


