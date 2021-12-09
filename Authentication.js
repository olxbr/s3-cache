const AWS = require('aws-sdk');
const ASSUMEROLE_AWS = require('@aws-sdk/client-sts');
const process = require('process');

class Authentication {
  constructor(access_id, secret_key, region) {
    this.access_id = access_id;
    this.secret_key = secret_key;
    this.region = region;
    this.connection = null;
  }

  assumeRoleLogin(role, roleSessionName, externalId) {
    return new Promise((resolve, reject) => {
    const client = new ASSUMEROLE_AWS.STS({ region: this.region });
    const params = { "RoleArn":  role, "RoleSessionName":  roleSessionName, "ExternalId": externalId };
    try {
      client.assumeRole(params).then(data => {
        this.access_id = data.Credentials.AccessKeyId;
        this.secret_key = data.Credentials.SecretAccessKey;
        this.session_token = data.Credentials.SessionToken;
        this.replace_env_keys();
        resolve()
      })
    } catch (error) {
      process.exit(1);
    }
  })
}

  backup_env_keys() {
    process.env.TEMP_AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID; 
    process.env.TEMP_AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
  }

  replace_env_keys() {
    process.env.AWS_ACCESS_KEY_ID = this.access_id;
    process.env.AWS_SECRET_ACCESS_KEY = this.secret_key;
    if (this.session_token) {
      process.env.AWS_SESSION_TOKEN = this.session_token;
    }
  }

  login(role, roleSessionName, externalId) {
    return new Promise((resolve, reject) => {
      if (!this.connection) {
        this.backup_env_keys();
        this.replace_env_keys();
        if (role) {
          this.assumeRoleLogin(role, roleSessionName, externalId).then(() => {
            this.connection = AWS;
            resolve(this.connection);
          })
        } else {
          this.connection = AWS;
          resolve(this.connection);
        }
      } else {
       resolve(this.connection);
     }
    })
  }

  logout() {
    process.env.AWS_ACCESS_KEY_ID = process.env.TEMP_AWS_ACCESS_KEY_ID;
    process.env.AWS_SECRET_ACCESS_KEY = process.env.TEMP_AWS_SECRET_ACCESS_KEY;
    process.env.TEMP_AWS_ACCESS_KEY_ID = null; 
    process.env.TEMP_AWS_SECRET_ACCESS_KEY = null;
  }
};

module.exports = Authentication;