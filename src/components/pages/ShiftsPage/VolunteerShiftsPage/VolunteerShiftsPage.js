import React from 'react';
import { connect } from 'react-redux';
import Layout from '../../../Layout/Layout';
import ShiftList from '../../../ShiftList';
import './VolunteerShiftsPage.css';
import shiftsActions from '../../../../_actions/shifts.actions';

class VolunteerShiftsPage extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const { uid } = JSON.parse(localStorage.getItem('user'));
    dispatch(shiftsActions.getForUser(uid, false));
  }

  render() {
    const { shifts, error, loading } = this.props;

    if (loading === true) {
      return null;
    }

    if (error) {
      return <p>error</p>;
    }
    console.log('SHIFTS', shifts);

    return (
      <Layout heading="Book a shift">
        <ShiftList shifts={shifts.all} recommendedCardClass="bg-primary" />
        <hr />
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  const { shifts, error, loading } = state.shifts;
  return {
    shifts,
    error,
    loading
  };
};

export default connect(mapStateToProps)(VolunteerShiftsPage);
