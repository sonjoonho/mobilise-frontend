import shiftsConstants from '../_constants/shifts.constants';
import shiftsService from '../_services/shifts.service';
import alertActions from './alert.actions';

const getAll = (after, before, page, firstTime = false) => {
  const request = () => ({ type: shiftsConstants.GETALL_REQUEST });
  const success = shifts => ({
    type: firstTime
      ? shiftsConstants.GETFIRST_SUCCESS
      : shiftsConstants.GETALL_SUCCESS,
    shifts
  });
  const failure = error => ({ type: shiftsConstants.GETALL_FAILURE, error });

  return dispatch => {
    dispatch(request());

    shiftsService.getAll(after, before, page).then(
      shifts => dispatch(success(shifts)),
      error => {
        dispatch(failure(error));
      }
    );
  };
};

// Gets available + recommended shifts for the specified user.
const getAvailableForUser = (uid, after, page, firstTime = false) => {
  const request = () => ({ type: shiftsConstants.GETFORUSER_REQUEST });
  const success = shifts => ({
    type: firstTime
      ? shiftsConstants.GETFIRST_SUCCESS
      : shiftsConstants.GETFORUSER_SUCCESS,
    shifts
  });
  const failure = error => ({
    type: shiftsConstants.GETFORUSER_FAILURE,
    error
  });

  return dispatch => {
    dispatch(request());

    shiftsService.getAvailableForUser(uid, after, page).then(
      shifts => dispatch(success(shifts)),
      error => {
        dispatch(alertActions.error('Error getting available shifts.'));
        return dispatch(failure(error));
      }
    );
  };
};

// Gets booked shifts for the specified user.
const getBookedForUser = (uid, after, before, page, firstTime = false) => {
  const request = () => ({ type: shiftsConstants.GETBOOKEDFORUSER_REQUEST });
  const success = myShifts => ({
    type: firstTime
      ? shiftsConstants.GETBOOKEDFIRST_SUCCESS
      : shiftsConstants.GETBOOKEDFORUSER_SUCCESS,
    myShifts
  });
  const failure = error => ({
    type: shiftsConstants.GETBOOKEDFORUSER_FAILURE,
    error
  });

  return dispatch => {
    dispatch(request());

    shiftsService.getBookedForUser(uid, after, before, page).then(
      shifts => dispatch(success(shifts)),
      error => {
        dispatch(alertActions.error('Error getting booked shifts.'));
        return dispatch(failure(error));
      }
    );
  };
};

const deleteWithId = shiftId => {
  const request = id => {
    return { type: shiftsConstants.DELETE_REQUEST, id };
  };
  const success = id => {
    return { type: shiftsConstants.DELETE_SUCCESS, id };
  };
  const failure = (id, error) => {
    return { type: shiftsConstants.DELETE_FAILURE, id, error };
  };

  return dispatch => {
    dispatch(request(shiftId));

    shiftsService.deleteWithId(shiftId).then(
      () => {
        dispatch(alertActions.success('Successfully deleted a shift'));
        return dispatch(success(shiftId));
      },
      error => {
        dispatch(alertActions.error('Error deleting a shift'));
        return dispatch(failure(shiftId, error));
      }
    );
  };
};

const book = (shiftId, roleName, repeatedType, until) => {
  const request = id => {
    return { type: shiftsConstants.BOOK_REQUEST, id };
  };
  const success = id => {
    return { type: shiftsConstants.BOOK_SUCCESS, id };
  };
  const failure = (id, error) => {
    return { type: shiftsConstants.BOOK_FAILURE, id, error };
  };

  return dispatch => {
    dispatch(request(shiftId));

    shiftsService.book(shiftId, roleName, repeatedType, until).then(
      () => {
        dispatch(success(shiftId));
        dispatch(alertActions.success('Booked successfully!'));
      },
      error => {
        dispatch(failure(shiftId, error));
        dispatch(
          alertActions.error('Something went wrong with booking this shift!')
        );
      }
    );
  };
};

const cancel = (shiftId, reason) => {
  const request = id => {
    return { type: shiftsConstants.CANCEL_REQUEST, id };
  };
  const success = id => {
    return { type: shiftsConstants.CANCEL_SUCCESS, id };
  };
  const failure = (id, error) => {
    return { type: shiftsConstants.CANCEL_FAILURE, id, error };
  };

  return dispatch => {
    dispatch(request(shiftId));

    shiftsService.cancel(shiftId, reason).then(
      () => {
        dispatch(success(shiftId));
        dispatch(
          alertActions.success(
            'Cancelled successfully, the shift manager has been notified.'
          )
        );
      },
      error => {
        dispatch(failure(shiftId, error));
        dispatch(
          alertActions.error('Something went wrong when cancelling the shift.')
        );
      }
    );
  };
};

// Updates the information and roles required for a shift.
const update = (shiftId, shiftData) => {
  const request = id => {
    return { type: shiftsConstants.UPDATE_REQUEST, id };
  };
  const success = (id, data) => {
    return { type: shiftsConstants.UPDATE_SUCCESS, id, data };
  };
  const failure = (id, error) => {
    return { type: shiftsConstants.UPDATE_FAILURE, id, error };
  };

  const { title, description, address, rolesRequired } = shiftData;
  const info = { title, description, address };

  return dispatch => {
    dispatch(request(shiftId));

    // Update info
    const infoPromise = shiftsService.updateInfo(shiftId, info);
    // Update roles
    const rolesPromise = shiftsService.updateRoles(shiftId, rolesRequired);

    // Wait for both
    const promise = Promise.all([infoPromise, rolesPromise]);

    promise.then(
      () => {
        dispatch(success(shiftId, shiftData));
        dispatch(alertActions.success('Shift updated successfully!'));
      },
      error => {
        dispatch(failure(shiftId, error));
        dispatch(
          alertActions.error('Something went wrong with updating this shift!')
        );
      }
    );
  };
};

const ping = shiftId => {
  const request = id => {
    return { type: shiftsConstants.PINGALL_REQUEST, id };
  };
  const success = id => {
    return { type: shiftsConstants.PINGALL_SUCCESS, id };
  };
  const failure = (id, error) => {
    return { type: shiftsConstants.PINGALL_FAILURE, id, error };
  };

  return dispatch => {
    dispatch(request(shiftId));

    shiftsService.ping(shiftId).then(
      () => {
        dispatch(success(shiftId));
        dispatch(alertActions.success('Volunteers pinged successfully'));
      },
      error => {
        dispatch(failure(shiftId, error));
        dispatch(alertActions.error('There was a problem pinging volunteers.'));
      }
    );
  };
};

const shiftsActions = {
  getAll,
  getAvailableForUser,
  getBookedForUser,
  deleteWithId,
  book,
  cancel,
  update,
  ping
};

export default shiftsActions;
