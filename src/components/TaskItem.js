import React, { Component } from "react"

import FaEdit from "react-icons/lib/fa/edit"
import CheckSquare from "react-icons/lib/fa/check-square"
import Cancel from "react-icons/lib/fa/close"

import moment from "moment"

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
        const { editedLocation, editedTime, editedTitle} = this.state
        let timeStr = moment(editedTime, "HH:mm").format("HH:mm")
        this.props.onEdit(id, {title : editedTitle, location: editedLocation, time: timeStr })
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
            toggleEdit: false
        })
    }

    deleteModal = () => {
        const { id } = this.props

        return (
            <div className="task-item">
                <li className="selected-item">
                    <p>Are you sure you want to delete this?</p>
                    <CheckSquare className="confirm-btn" onClick={() => this.handleDelete(id)} />
                    <Cancel className="close-remove" onClick={this.cancelSelectedMode}>&times;</Cancel>
                </li>
            </div>
        )
    }

    editModal = () => {
        const { title, location, id } = this.props
        return (
            <div>
                <div className="selected-item">
                    <input type="text" className="span1" onChange={e => this.onEditingTitle(e.target.value)} placeholder={title} value={this.state.editedTitle} />
                    at <input type="time" onChange={e => this.onEditingTime(e.target.value)} value={this.state.editedTime} /><br />
                    In <input type="text" className="span1" onChange={e => this.onEditingLocation(e.target.value)} placeholder={location} value={this.state.editedLocation} />
                    <CheckSquare className="confirm-btn" onClick={() => this.handleEdit(id)} />
                    <Cancel className="close-remove" onClick={this.cancelSelectedMode}>&times;</Cancel>
                </div>
            </div>
        )
    }

    render() {
        const { title, location, time } = this.props

        if (this.state.toggleDelete) {
            return this.deleteModal()
        }
        if (this.state.toggleEdit) {
            return this.editModal()
        }

        return (
            <div className="task-item">
                <li> <strong> {title} at {time} </strong> <br />
                    In {location}
                    <button className="close" onClick={this.activateDeleteMode}>&times;</button>
                    <FaEdit className="edit-btn" onClick={this.activateEditMode} />
                </li>
            </div>
        )
    }
}

export default TaskItem;


