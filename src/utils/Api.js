import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { api_base_uri } from '../constants/env';
import { RESET_USER } from './reduxConstant';
import { StackActions } from '@react-navigation/native';

class Api {
  constructor() {
    // Clear any existing default headers
    axios.defaults.headers.common = {};
    // Set only the X-API-KEY header
    this.defaultHeader({
      'X-API-KEY': '1234567890abcdefghijklmnopqrstuvwxyz1234',
    });
  }

  defaultHeader(object) {
    // Set only the provided headers
    axios.defaults.headers.common = { ...object };
  }

  // Helper method to ensure only X-API-KEY is used unless explicitly overridden
  getHeaders(customHeaders = {}) {
    // Return only X-API-KEY unless custom headers are provided
    return {
      'X-API-KEY': '1234567890abcdefghijklmnopqrstuvwxyz1234',
      ...customHeaders,
    };
  }

  GET(endpoint, params = {}, customHeaders = {} = {}) {
    return new Promise(resolve => {
      axios({
        method: 'GET',
        url: this.normalizePath(endpoint),
        params,
        headers: this.getHeaders(customHeaders),
        validateStatus: function (status) {
          return status !== 404;
        },
      })
        .then(response => {
          console.log(
            'headers:', this.getHeaders(customHeaders),
            'GET endpoint:', endpoint,
            'API params:', params,
            'API Response:', JSON.stringify(response.data)
          );
            resolve(response.data);
        })
        .catch(error => this.handleError(error, resolve));
    });
  }

  POST(endpoint, params = {}, customHeaders = {} = {}) {
    return new Promise(resolve => {
      axios({
        method: 'post',
        url: this.normalizePath(endpoint),
        data: params, // Send params directly (Axios will handle JSON serialization)
        headers: this.getHeaders(customHeaders),
        validateStatus: function (status) {
          return status !== 404;
        },
      })
        .then(response => {
          console.log(
            'headers:', this.getHeaders(customHeaders),
            'POST endpoint:', endpoint,
            'API params:', params,
            'API Response:', JSON.stringify(response.data)
          );
            resolve(response.data);
        })
        .catch(error => this.handleError(error, resolve));
    });
  }

  DELETE(endpoint, params = {}, customHeaders = {}) {
    return new Promise(resolve => {
      axios({
        method: 'delete',
        url: this.normalizePath(endpoint),
        params,
        headers: this.getHeaders(customHeaders),
        validateStatus: function (status) {
          return status !== 404;
        },
      })
        .then(response => {
          console.log(
            'headers:', this.getHeaders(customHeaders),
            'DELETE endpoint:', endpoint,
            'API params:', params,
            'API Response:', JSON.stringify(response.data)
          );
          resolve(response.data);
        })
        .catch(error => this.handleError(error, resolve));
    });
  }

  PUT(endpoint, params = {}, customHeaders = {}) {
    return new Promise(resolve => {
      axios({
        method: 'put',
        url: this.normalizePath(endpoint),
        data: params, // Send params directly
        headers: this.getHeaders(customHeaders),
        validateStatus: function (status) {
          return status !== 404;
        },
      })
        .then(response => {
          console.log(
            'headers:', this.getHeaders(customHeaders),
            'PUT endpoint:', endpoint,
            'API params:', params,
            'API Response:', JSON.stringify(response.data)
          );
          resolve(response.data);
        })
        .catch(error => this.handleError(error, resolve));
    });
  }

  POSTFORMDATA(endpoint, params = {}, customHeaders = {}) {
    return new Promise(resolve => {
      const data = new FormData();
      if (params) {
        Object.keys(params).forEach(key => {
          data.append(key, params[key]);
        });
      }
      axios({
        method: 'post',
        url: this.normalizePath(endpoint),
        data: data,
        headers: this.getHeaders(customHeaders), // Use same header logic
        validateStatus: function (status) {
          return status !== 404;
        },
        onUploadProgress: progressEvent => {
          let { loaded, total } = progressEvent;
          console.log('progress------', (loaded / total) * 100);
        },
      })
        .then(response => {
          console.log(
            'headers:', this.getHeaders(customHeaders),
            'POSTFORMDATA endpoint:', endpoint,
            'API params:', params,
            'API Response:', JSON.stringify(response.data)
          );
          resolve(response.data);
        })
        .catch(error => this.handleError(error, resolve));
    });
  }

  handleError(error, resolve) {
    console.log('API error:', error);
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        resolve({ success: false, message: 'Oops! Something is wrong' });
      } else {
        resolve({ success: false, message: 'You are currently offline' });
      }
    });
  }

  normalizePath(endpoint) {
    console.log('api endpoint: ', api_base_uri);
    return `${api_base_uri}/${endpoint}`;
  }
}

export default new Api();