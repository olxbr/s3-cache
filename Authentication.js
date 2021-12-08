const AWS = require('aws-sdk');
const core = require('@actions/core');
import * as ASSUMEROLE_AWS from "@aws-sdk/client-sts";

class Authentication {
  constructor(access_id, secret_key, region) {
    this.access_id = access_id;
    this.secret_key = secret_key;
    this.region = region;
    this.connection = null;
  }

  login() {
    if (!this.connection) {
      process.env.TEMP_AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID; 
      process.env.TEMP_AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
      process.env.AWS_ACCESS_KEY_ID = this.access_id;
      process.env.AWS_SECRET_ACCESS_KEY = this.secret_key;
    }
    return AWS;
  }

  assumeRoleLogin(role) {
    const client = new ASSUMEROLE_AWS.STS({ region: this.region });
    const params = { "RoleArn":  role };
    const data = await client.assumeRole(params);
    this.access_id = data.access_id;
    this.secret_key = data.secret_key;
    this.login();
  }

  logout() {
    process.env.AWS_ACCESS_KEY_ID = process.env.TEMP_AWS_ACCESS_KEY_ID;
    process.env.AWS_SECRET_ACCESS_KEY = process.env.TEMP_AWS_SECRET_ACCESS_KEY;
    process.env.TEMP_AWS_ACCESS_KEY_ID = null; 
    process.env.TEMP_AWS_SECRET_ACCESS_KEY = null;
  }
};

module.exports = Authentication;