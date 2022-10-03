import runtimeEnv from '@mars/heroku-js-runtime-env';

const env = runtimeEnv();
const config = {
  apiBasePath: env.REACT_APP_API_BASE_PATH || 'https://62.84.120.87',
  reactAppMode: process.env.REACT_APP_MODE || 'dev',
};

export default config;
