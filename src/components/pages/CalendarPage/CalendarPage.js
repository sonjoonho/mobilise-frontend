import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Button, Col } from 'react-bootstrap';
import CalendarView from '../CalendarView';
import Layout from '../../Layout/Layout';
import shiftsActions from '../../../_actions/shifts.actions';

class CalendarPage extends React.Component {
  componentDidMount() {
    const startDate = moment().startOf('week');
    const lastDate = moment().endOf('week');
    this.retrieveBookedShiftsInRange(startDate, lastDate);
    this.retrieveShiftsInRange(startDate, lastDate);
  }

  exportCalendar = () => {
    const { dispatch } = this.props;
    const { uid } = JSON.parse(localStorage.getItem('user'));

    dispatch(shiftsActions.getCalendarForUser(uid));
  };

  handleCalendarRangeChange = dates => {
    const startDate = moment(dates[0]).startOf('week');
    const lastDate = moment(dates[0]).endOf('week');

    this.retrieveBookedShiftsInRange(startDate, lastDate);
    this.retrieveShiftsInRange(startDate, lastDate);
  };

  retrieveBookedShiftsInRange = (startDate, lastDate) => {
    const { dispatch } = this.props;
    let { myShifts } = this.props;
    const { uid } = JSON.parse(localStorage.getItem('user'));
    let firstTime = false;
    if (!myShifts) {
      firstTime = true;
      myShifts = [];
    }
    let lastShiftDate = moment();
    const lastShift = myShifts[myShifts.length - 1];
    if (lastShift) {
      lastShiftDate = moment(`${lastShift.date} ${lastShift.start}`);
    }

    if (lastDate.isAfter(lastShiftDate)) {
      dispatch(
        shiftsActions.getBookedForUser(
          uid,
          startDate.format(),
          lastDate.format(),
          null,
          firstTime
        )
      );
    }
  };

  retrieveShiftsInRange = (startDate, lastDate) => {
    const { dispatch } = this.props;
    let { shifts } = this.props;
    const { uid } = JSON.parse(localStorage.getItem('user'));
    let firstTime = false;
    if (!shifts) {
      firstTime = true;
      shifts = [];
    }
    const lastShift = shifts[shifts.length - 1];
    let lastShiftDate = moment();
    if (lastShift) {
      lastShiftDate = moment(`${lastShift.date} ${lastShift.start}`);
    }
    if (lastDate.isAfter(lastShiftDate)) {
      dispatch(
        shiftsActions.getAvailableForUser(
          uid,
          startDate.format(),
          lastDate.format(),
          null,
          firstTime
        )
      );
    }
  };

  render() {
    const { shifts, myShifts, error } = this.props;

    if (!shifts || !myShifts) {
      return null;
    }

    if (error) {
      return <p>error</p>;
    }

    return (
      <Layout heading="All Shifts" cornerComponent={null}>
        <Col style={{ textAlign: 'right', zIndex: '0' }}>
          <Button variant="outline-primary" onClick={this.exportCalendar}>
            Export
          </Button>
        </Col>
        <CalendarView
          shifts={shifts}
          myShifts={myShifts}
          onRangeChange={this.handleCalendarRangeChange}
        />
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  const { shifts, myShifts, error } = state.shifts;
  return {
    shifts,
    myShifts,
    error
  };
};

export default connect(mapStateToProps)(CalendarPage);