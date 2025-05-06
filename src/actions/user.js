import { StackActions } from '@react-navigation/native';
import Api from '../utils/Api';
import { RESET_USER, SET_DEVICE_TOKEN, SET_USER_TOKEN, USER_LOGIN_DETAILS } from '../utils/reduxConstant';
import { Alert } from 'react-native';

let showLogout = true;

export function setLoginDetails(data) {
  return dispatch => {
    dispatch({ type: USER_LOGIN_DETAILS, payload: data });
  };
}

export function setDeviceToken(data) {
  return dispatch => {
    dispatch({ type: SET_DEVICE_TOKEN, payload: data });
  };
}

// export function setUserToken(data) {
//   return dispatch => {
//     dispatch({ type: SET_USER_TOKEN, payload: data });
//     const request = {
//       Authorization: `Bearer ${data}`,
//     };
//     console.log('Common Header Updated:', JSON.stringify(request));
//     Api.defaultHeader(request); 
//   };
// }
export const setUserToken = (token) => ({
  type: SET_USER_TOKEN,
  payload: token,
});

export const updateAuthHeader = (token) => {
  return () => {
    const headers = { Authorization: `Bearer ${token}` };
    console.log('Common Header Updated:', headers);
    Api.defaultHeader(headers);
  };
};

export function userLogin(data) {
  return async dispatch => {
    try {
      const res = await Api.POST('auth/login', data);
      if (res.status) {
        const userWithToken = {
          ...res.data,
          token: res.token,
        };
        dispatch(setLoginDetails(userWithToken));
        dispatch(setUserToken(res.token));
        dispatch(updateAuthHeader(res.token));
        return { status: res.status, data: res.data, message: res.message };
      } else {
        return { status: res.status, message: res.message };
      }
    } catch (error) {
      console.log('userLogin Error: ', error);
      return { status: false, message: 'Oops, Something Went Wrong' };
    }
  };
}

export function userSignup(data) {
  return async dispatch => {
    try {
      const res = await Api.POST('auth/register', data);

      if (res.status) {
        dispatch(setLoginDetails(res.data));
        dispatch(setUserToken(res.token));
        dispatch(updateAuthHeader(res.token));
        return { success: res.status, message: res.message, data: res.data, };
      } else {
        return { success: res.status, message: res.message  };
      }
    } catch (error) {
      console.log('userLogin Error: ', error);
      return { success: false, message: 'Oops, Something Went Wrong' };
    }
  };
}

export async function verifyOtp(data) {
  try {
    const res = await Api.POST('auth/verify_otp', data);

    if (res.status) {
      return { success: res.status, data: res.data, message: res.message };
    } else {
      return { success: res.status, message: res.message };
    }
  } catch (error) {
    console.log('add_address Error: ', error);
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}


export async function createDoctor(data) {
  try {
    const res = await Api.POST('doctor/create', data);

    if (res.status) {
      return { success: res.status, data: res.data, message: res.message };
    } else {
      return { success: res.status, message: res.message, code: res.code };
    }
  } catch (error) {
    console.log('doctor/create Error: ', error);
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

export async function productCategories() {
  try {
    const res = await Api.GET('product/categories');

    if (res.status) {
      return { success: res.status, data: res.data, message: res.message };
    } else {
      return { success: res.status, message: res.message, code: res.code };
    }
  } catch (error) {
    console.log('doctor/list Error: ', error);
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

export async function productList(data) {
  try {
    const res = await Api.GET('product/details',data);
    if (res.status) {
      return { success: res.status, data: res.data, message: res.message };
    } else {
      return { success: res.status, message: res.message, code: res.code };
    }
  } catch (error) {
    console.log('doctor/list Error: ', error);
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

export async function getDoctorByUser(data, userId) {
  try {
    const res = await Api.GET('doctor/list', data, {
      'User-Id': userId,
    });
    if (res.status) {
      return { success: res.status, data: res.data, message: res.message };
    } else {
      return { success: res.status, message: res.message, code: res.code };
    }
  } catch (error) {
    console.log('doctor/list Error: ', error);
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

export async function getDoctorList(data, userId) {
  try {
    const res = await Api.GET('doctor/all', data);

    if (res.status) {
      return { success: res.status, data: res.data, message: res.message, pagination: res.pagination };
    } else {
      return { success: res.status, message: res.message, data: res.data, code: res.code };
    }
  } catch (error) {
    console.log('doctor/list Error: ', error);
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

export async function helperPerson(data) {
  try {
    const res = await Api.GET('helper_person/list', data);
    if (res.status) {
      return { success: res.status, data: res.data, message: res.message };
    } else {
      return { success: res.status, message: res.message, code: res.code };
    }
  } catch (error) {
    console.log('helper_person/list Error: ', error);
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}


export async function createHelper(data) {
  try {
    const res = await Api.POST('helper_person/create', data);

    if (res.status) {
      return { success: res.status, data: res.data, message: res.message };
    } else {
      return { success: res.status, message: res.message, code: res.code };
    }
  } catch (error) {
    console.log('helper_person/create Error: ', error);
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

export async function helperList() {
  try {
    const res = await Api.GET('helper_person/list');

    if (res.status) {
      return { success: res.status, data: res.data, message: res.message };
    } else {
      return { success: res.status, message: res.message, code: res.code };
    }
  } catch (error) {
    console.log('helper_person/create Error: ', error);
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

export async function Logout(data) {
  try {
    const res = await Api.POST('auth/logout', data);

    if (res.status) {
      return { success: res.status, data: res.data, message: res.message };
    } else {
      return { success: res.status, message: res.message, code: res.code };
    }
  } catch (error) {
    console.log('auth/logout Error: ', error);
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

export async function DeleteAccount(data) {
  try {
    const res = await Api.POST('auth/delete_account', data);

    if (res.status) {
      return { success: res.status, data: res.data, message: res.message };
    } else {
      return { success: res.status, message: res.message, code: res.code };
    }
  } catch (error) {
    console.log('auth/delete_account Error: ', error);
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

export async function UserList() {
  try {
    const res = await Api.GET('auth/list');

    if (res.status) {
      return { success: res.status, data: res.data, message: res.message };
    } else {
      return { success: res.status, message: res.message, code: res.code };
    }
  } catch (error) {
    console.log('auth/list Error: ', error);
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

export async function masterCreate(data) {
  try {
    const res = await Api.POST('activity_master/create', data);

    if (res.status) {
      return { success: res.status, data: res.data, message: res.message };
    } else {
      return { success: res.status, message: res.message, code: res.code };
    }
  } catch (error) {
    console.log('activity_master/create Error: ', error);
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}



export async function activityList(data) {
  try {
    const res = await Api.GET('activity_master/list',data);

    if (res.status) {
      return { success: res.status, data: res.data, message: res.message };
    } else {
      return { success: res.status, message: res.message, code: res.code };
    }
  } catch (error) {
    console.log('activity_master/list Error: ', error);
    return { success: false, message: 'Oops, Something Went Wrong' };
  }
}

