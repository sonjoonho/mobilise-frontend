import axios from 'axios';
import utils from './utils.service';
import authHeader from '../_helpers/auth-header';

const deleteWithId = shiftId => {
  const config = {
    headers: authHeader()
  };

  console.log('Deleting shift with ID', shiftId);

  return axios.delete(`/shifts/${shiftId}`, config).then(utils.handleResponse);
};

const bookWithIdAndRole = (shiftId, roleName) => {
  const config = {
    headers: authHeader()
  };

  const data = {
    roleName
  };

  console.log('Booking shift with ID', shiftId);

  return axios
    .post(`shifts/${shiftId}/book`, config, data)
    .then(utils.handleResponse);
};

const shiftService = {
  deleteWithId,
  bookWithIdAndRole
};

export default shiftService;
