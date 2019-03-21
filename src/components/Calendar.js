import React, { Component } from "react"
import moment from "moment"

import { Dropdown } from 'react-bootstrap'
import { FaCaretDown } from 'react-icons/fa'

const daysNames = moment.weekdaysShort()
const monthsNames = moment.months()

class Calender extends Component {
    state = {
        dateContext: moment(),
        todayStr: moment().format("ddd, D MMM, YYYY")
    }

    shouldComponentUpdate(nextProps) {
        if (Object.keys(nextProps.agenda).length === 0 || nextProps.selectedDay !== this.state.dateContext) {
            return true
        }
        return false
    }

    firstDayOfMonth = () => {
        const { dateContext } = this.state
        let firstDay = moment(dateContext).startOf("month").format("d")
        return firstDay
    }

    handleMonthChange = (e, month) => {
        const { dateContext } = this.state
        const monthNumber = monthsNames.indexOf(month)
        let setDate = moment(dateContext).set("month", monthNumber)
        this.setState({
            dateContext: setDate
        })
    }

    handleYearChange = (e, year) => {
        const { dateContext } = this.state
        let setDate = moment(dateContext).set("year", year)
        this.setState(({
            dateContext: setDate
        }))
    }

    changeDay = (e, dayNum) => {
        const { dateContext } = this.state
        this.props.changeDate(moment(dateContext).date(dayNum))
    }

    monthDropdown = () => {
        const selectedMonth = moment(this.state.dateContext).format("MMMM");

        let monthsNamesItems = monthsNames.map(month => {
            return (
                <li key={month} className={selectedMonth === month ? 'dropdown-item active' : ''}>
                    <a href={"#" + month} onClick={(e) => this.handleMonthChange(e, month)}>
                        {month}
                    </a>
                </li>
            )
        })

        return (
            <Dropdown style={{ width: '25%', paddingRight: 20 }} >
                <Dropdown.Toggle style={{ backgroundColor: 'white', color: 'black', width: '100%' }} >
                    {selectedMonth}  <FaCaretDown />
                </Dropdown.Toggle>
                <Dropdown.Menu  >
                    {monthsNamesItems}
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    yearDropdown = () => {
        const year = moment(this.state.dateContext).format("Y")

        const currentYear = moment().format("Y")
        let yearsItems = [currentYear]
        for (let y = 1; y <= 5; y++) {
            yearsItems.push(moment(currentYear, "Y").add(y, "year").format("Y"))
            yearsItems.unshift(moment(currentYear, "Y").subtract(y, "year").format("Y"))
        }

        let yearsEleArray = yearsItems.map(item => {
            return (
                <li key={item} className={item === year ? "dropdown-item active" : ''}>
                    <a href={"#" + item} onClick={(e) => this.handleYearChange(e, item)}>
                        {item}
                    </a>
                </li>
            )
        })

        return (
            <Dropdown style={{ width: '25%' }}>
                <Dropdown.Toggle style={{ backgroundColor: 'white', color: 'black', width: '100%' }} id="dropdown-basic">
                    {year} <FaCaretDown />
                </Dropdown.Toggle>
                <Dropdown.Menu  >
                    {yearsEleArray}
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    renderTasksIndicators = (dayTotalTasks) => {
        let res = []
        let i = 0
        for (i; i < dayTotalTasks; i++) {
           res.push(
                <strong key={i} style={{fontSize: '30px'}}>.</strong>
            )
        }
        return res
    }

    render() {
        const { dateContext, todayStr } = this.state
        const { agenda } = this.props
        const daysInMonth = moment(dateContext).daysInMonth()

        let blanks = []
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(<td key={i % 77} className="blanks"> {" "}  </td>)
        }

        let daysNamesCells = daysNames.map((day, i) => {
            return (
                <td key={i / 88} style={day === "Sun" || day === "Sat" ? styles.weekendsCellsStyle : {}} className="week-header-cell">
                    <strong>
                        {day}
                    </strong>
                </td>
            )

        })
        let monthDays = []
        for (let i = 1; i <= daysInMonth; i++) {
            let dateId = dateContext.date(i).format("ddd, D MMM, YYYY")
            let checkWeekends = moment(dateContext).day()
            let isBusyDay = Object.keys(agenda).some(key => (key === dateId))
            let dayTotalTasks = agenda[dateId] && agenda[dateId].length ? agenda[dateId].length : 0

            monthDays.push(
                <td id={dateId}
                    style={todayStr === dateId ? styles.todayCellStyle : dateId === this.props.selectedDay ? styles.selectedDay : checkWeekends === 0 || checkWeekends === 6 ? styles.weekendsCellsStyle : {}} className="day-cell" key={dateId} onClick={(e) => this.changeDay(e, i)}>
                    {i}
                    <div style={{lineHeight: '0px'}}>
                        {dayTotalTasks ?
                            this.renderTasksIndicators(dayTotalTasks)
                            : null}
                    </div>
                </td>
            )

        }

        let totalCells = [...blanks, ...monthDays]
        let rows = []
        let cells = []

        totalCells.forEach((cell, i) => {
            if (i % 7 === 0 && i === totalCells.length - 1) {
                let row = cells.slice()
                rows.push(row)
                cells = []
                cells.push(cell)
                row = cells.slice()
                rows.push(row)
            } else if (i % 7 === 0) {
                let row = cells.slice()
                rows.push(row)
                cells = []
                cells.push(cell)
            } else if (i === totalCells.length - 1) {
                cells.push(cell)
                let row = cells.slice()
                rows.push(row)
            } else {
                cells.push(cell)
            }
        })

        let daysItems = rows.map((daysRow, i) => {
            return <tr key={i / 97}>{daysRow}</tr>
        })

        let totalTasks = 0
        Object.keys(this.props.agenda).forEach(key => {
            totalTasks += this.props.agenda[key].length
        })

        return (
            <div className="calendar-div">
                <div className="calendar-header">
                    {this.monthDropdown()}
                    {this.yearDropdown()}
                </div>
                <table className="calendar">
                    <thead>
                        <tr>
                            {daysNamesCells}
                        </tr>
                    </thead>
                    <tbody>
                        {daysItems}
                    </tbody>
                </table>
                <p className="total-container">
                    Total appointments in your calendar: <strong> {totalTasks}</strong>
                    <button type="button" className="btn btn-danger deleteAll-btn" onClick={this.props.deleteAll} >Delete all</button>
                </p>
            </div>
        )
    }
}

const styles = {
    todayCellStyle: {
        backgroundColor: 'rgba(255, 226, 0, 0.75)',
        color: 'black',
        cursor: 'pointer',
        margin: 'auto',
        textAlign: 'center'
    },
    selectedDay: {
        border: '2px solid black'
    },
    weekendsCellsStyle: {
        color: 'red',
    },

}

export default Calender