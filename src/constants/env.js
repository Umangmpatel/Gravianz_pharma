// export const api_base_uri = 'http://192.168.29.243:9090/api/v1';

const live = false;
const stage = false;
const dev = false;
let api_base_uri = '';

if (live) {
  api_base_uri = 'https://gravianzpharma.com/api';
} else if (stage) {
  api_base_uri = 'https://gravianzpharma.com/api';
} else if (dev) {
  api_base_uri = 'https://gravianzpharma.com/api';
} else {
  api_base_uri = 'https://gravianzpharma.com/api';
}

export {api_base_uri};
