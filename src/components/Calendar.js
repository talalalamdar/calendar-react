import React, { Component } from "react"
import moment from "moment"

const daysNames = moment.weekdaysShort()
const monthsNames = moment.months()

class Calender extends Component {
    state = {
        dateContext: moment(),
    }

    componentDidMount() {
        this.updateClassesNames()
    }

    componentDidUpdate() {
        this.updateClassesNames()
    }

    updateClassesNames = () => {
        let todayStr = moment().format("ddd, D MMM, YYYY")
        if (document.getElementById(todayStr)) {
            document.getElementById(todayStr).setAttribute("id", "today-cell")
        }
        const agenda = this.props.agenda
        Object.keys(agenda).forEach(key => {
            if (document.getElementById(key)) {
                if (key === this.props.selectedDay) document.getElementById(key).setAttribute("class", "selectedDay day-cell")
                else if (agenda[key].length === 0) document.getElementById(key).setAttribute("class", "day-cell")
                else document.getElementById(key).setAttribute("class", "busy-days")
            }
        })
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
            if (selectedMonth === month) {
                return <li key={month} className="dropdown-item active"> <a href={"#" + month} onClick={(e) => this.handleMonthChange(e, month)}> {month} </a> </li>
            } else {
                return <li key={month} > <a href={"#" + month} onClick={(e) => this.handleMonthChange(e, month)}> {month} </a> </li>
            }
        })

        return (
            <div className="dropdown">
                <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">
                    {selectedMonth}
                </button>
                <ul className="dropdown-menu" >
                    {monthsNamesItems}
                </ul>
            </div>
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
            if (item === year) {
                return <li key={item} className="dropdown-item active"><a href={"#" + item} onClick={(e) => this.handleYearChange(e, item)}> {item} </a></li>
            } else {
                return <li key={item}><a href={"#" + item} onClick={(e) => this.handleYearChange(e, item)}> {item} </a></li>
            }
        })

    return (
            <div className = "dropdown" >
            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">
                {year}
            </button>
            <ul className="dropdown-menu" >
                {yearsEleArray}
            </ul>
            </div>
        )
    }

render() {
    const { dateContext } = this.state
    const daysInMonth = moment(dateContext).daysInMonth()

    let blanks = []
    for (let i = 0; i < this.firstDayOfMonth(); i++) {
        blanks.push(<td key={i % 77} className="blanks"> {" "}  </td>)
    }

    let daysNamesCells = daysNames.map((day, i) => {
        if (day === "Sun" || day === "Sat") {
            return <td key={i / 88} className="week-header-cell weekends-days"> <strong> {day} </strong> </td>
        }
        return <td key={i / 88} className="week-header-cell"> <strong> {day} </strong> </td>
    })

    let monthDays = []
    for (let i = 1; i <= daysInMonth; i++) {
        let dateId = dateContext.date(i).format("ddd, D MMM, YYYY")
        let checkWeekends = moment(dateContext).day()

        if (checkWeekends === 0 || checkWeekends === 6) {
            monthDays.push(<td id={dateId} className="day-cell weekends-days" key={dateId} onClick={(e) => this.changeDay(e, i)}> {i} </td>)
        } else {
            monthDays.push(<td id={dateId} className="day-cell" key={dateId} onClick={(e) => this.changeDay(e, i)}> {i} </td>)
        }
    }

    let totalCells = [...blanks, ...monthDays]
    let rows = []
    let cells = []

    totalCells.forEach((cell, i) => {
        if ( i % 7 === 0 && i === totalCells.length - 1 ) {
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
                Total appointments in your calendar: {totalTasks}
                <button type="button" className="btn btn-danger deleteAll-btn" onClick={this.props.deleteAll} >Delete all</button>
            </p>
        </div>
    )
}
}

export default Calender