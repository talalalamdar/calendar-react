import React, { Component } from "react"
import moment from "moment"

const daysNames = moment.weekdaysShort()
const monthsNames = moment.months()

class Calender extends Component {
    state = {
        setDate: moment(),
        today: moment(),
    }

    componentDidUpdate() {
        let todayStr = this.state.today.format("ddd, D MMM, YYYY")
        if (document.getElementById(todayStr)) {
            document.getElementById(todayStr).setAttribute("class", "today-cell")
        }
    }

    firstDayOfMonth = () => {
        const { setDate } = this.state
        let firstDay = moment(setDate).startOf("month").format("d")
        return firstDay
    }

    handleMonthChange = (e, month) => {
        const monthNumber = monthsNames.indexOf(month)
        let setDate = Object.assign({}, this.state.setDate)
        setDate = moment(setDate).set("month", monthNumber)
        this.setState({
            setDate: setDate
        })
    }

   handleYearChange = (e , year) => {
        let setDate = Object.assign({}, this.state.setDate)
        setDate = moment(setDate).set("year", year)
        this.setState(({
            setDate: setDate
        }))
    }

    changeDay = (e, dayNum) => {
        const { setDate } = this.state
        this.props.changeDate(setDate.date(dayNum))
    }

    monthDropdown = () => {
        const selectedMonth = this.state.setDate.format("MMMM");

        let monthsNamesItems = monthsNames.map(month => {
            if (selectedMonth == month) {
                return <li key={month} > <a href="#" class="dropdown-item active" onClick={(e) => this.handleMonthChange(e, month)}> {month} </a> </li>
            } else {
                return <li key={month} > <a href="#" onClick={(e) => this.handleMonthChange(e, month)}> {month} </a> </li>
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
        const year = this.state.setDate.format("Y")

        let yearsItems = []
        for (let y = 2000; y <= 2030; y++) {
            if (y == year) {
                yearsItems.push(<li key={y} ><a href="#" class="dropdown-item active" onClick={(e) => this.handleYearChange(e, y)}> {y} </a></li>)
            } else {
                yearsItems.push(<li key={y}><a href="#" onClick={(e) => this.handleYearChange(e, y)}> {y} </a></li>)
            }
        }
        
        return (
            <div className="dropdown">
                <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">
                    {year}
                </button>
                <ul className="dropdown-menu" >
                    {yearsItems}
                </ul>
            </div>
        )
    }

    render() {
        const { setDate, today } = this.state
        const daysInMonth = setDate.daysInMonth()

        let blanks = []
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(<td key={i % 77} className="blanks"> {" "}  </td>)
        }

        let daysNamesCells = daysNames.map((day, i) => {
            if (day == "Sun" || day == "Sat") {
                return <td key={i / 88} className="week-header-cell weekends-days"> <strong> {day} </strong> </td>
            }
            return <td key={i / 88} className="week-header-cell"> <strong> {day} </strong> </td>
        })

        let monthDays = []
        for (let i = 1; i <= daysInMonth; i++) {
            let dateId = setDate.date(i).format("ddd, D MMM, YYYY")
            let todayStr = today.format("ddd, D MMM, YYYY")
            let checkWeekends = setDate.day()

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
            if (i % 7 === 0) {
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
            return <tr key={i / 97}> {daysRow} </tr>
        })

        return (
            <div className="main-div-calendar">
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
                </div>
            </div>
        )
    }
}

export default Calender