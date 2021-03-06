import React, { Component } from 'react'
import dateFns from 'date-fns'
import axios from 'axios'

// UDCs
import Daily from './logger/Daily'
import Weekly from './logger/Weekly'

// css
import '../../../../styles/Logger.css'

export default class Logger extends Component {

  constructor(props) {
    super(props)

    this.state = {
      format: 'weekly',
      attendance: {},
    }
  }

  componentDidMount() {
    let date = new Date()
    date = dateFns.format(date, 'dddd') === 'Sunday' ? dateFns.addDays(date, 1) : date
    this.fetchWeekAttendance(date)
  }

  shouldComponentUpdate(nextProps, nextState) {

    if(this.state.format !== nextState.format) {
      let date = new Date()
      date = dateFns.format(date, 'dddd') === 'Sunday' ? dateFns.addDays(date, 1) : date  
      this.fetchWeekAttendance(date)
      return false
    }
    return true
  }

  fetchWeekAttendance = date => {
    this.props.updateAttendance()
    axios
      .get(`/attendance/${dateFns.format(dateFns.startOfISOWeek(date), 'YYYY-MM-DD')}/getWeekly`, {
        headers: {
          'Authorization': this.props.token
        }
      })
      .then(res => res.data && this.setState({attendance: res.data}))
      .catch(err => console.log(err.response.data))
  }

  render() {
  
    const state = {...this.state}
    const { format } = state
    return (
      <div className="att">
        {
          format === 'daily'
          ? <Daily
              attendance={this.state.attendance}
              timetable={this.props.timetable}
              token={this.props.token}
              // functions
              fetchWeekAttendance={this.fetchWeekAttendance}
            />
          : format === 'weekly'
          ? <Weekly
              attendance={this.state.attendance}
              timetable={this.props.timetable}
              token={this.props.token}
              // functions
              fetchWeekAttendance={this.fetchWeekAttendance}
            />
          : null
        }
        <div className="viewer">
          <button className={`viewer--switch-daily ${this.state.format === 'daily' ? 'active': null}`}
            onClick={() => this.setState({format: 'daily'})} >DAILY</button>
          <button className={`viewer--switch-weekly ${this.state.format === 'weekly' ? 'active': null}`}
            onClick={() => this.setState({format: 'weekly'})} >WEEKLY</button>
        </div>
      </div>
    )
  }
}
