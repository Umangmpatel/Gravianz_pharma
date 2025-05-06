import {
  RESET_USER,
  SET_DEVICE_TOKEN,
  SET_USER_TOKEN,
  USER_LOGIN_DETAILS,
} from '../../utils/reduxConstant';

const initialState = {
  userInfo: null,
  userToken: null,
  deviceToken: null,
};

export default function user(state = initialState, action = {}) {
  switch (action.type) {
    case USER_LOGIN_DETAILS: {
      return {
        ...state,
        userInfo: action.payload,
      };
    }
    case SET_USER_TOKEN: {
      return {
        ...state,
        userToken: action.payload,
      };
    }
    case SET_DEVICE_TOKEN: {
      return {
        ...state,
        deviceToken: action.payload,
      };
    }
    case RESET_USER: {
      return {
        ...state,
        userInfo: null,
        userToken: null,
      };
    }
    default:
      return state;
  }
}
