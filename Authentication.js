const AWS = require('aws-sdk');
const ASSUMEROLE_AWS = require('@aws-sdk/client-sts');
const process = require('process');

class Authentication {
  constructor(access_id, secret_key, region) {
    console.log(`Auth linha 7`);
    this.access_id = access_id;
    this.secret_key = secret_key;
    this.region = region;
    this.connection = null;
    this.session_token = null;
  }

  static emptyConnector() {
    return AWS;
  }

  assumeRoleLogin(role, roleSessionName, externalId) {
    console.log(`Auth linha 20`);
    return new Promise((resolve, reject) => {
      console.log(`Auth linha 22`);
      const client = new ASSUMEROLE_AWS.STS({ region: this.region });
      const params = { "RoleArn":  role, "RoleSessionName":  roleSessionName, "ExternalId": externalId };
      try {
        console.log(`Auth linha 26`);
        client.assumeRole(params).then(data => {
          console.log(`Auth linha 28`);
          this.access_id = data.Credentials.AccessKeyId;
          this.secret_key = data.Credentials.SecretAccessKey;
          this.session_token = data.Credentials.SessionToken;
          this.replace_env_keys();
          resolve()
        })
      } catch (error) {
        console.log(`Auth linha 36`);
        console.log(error)
        process.exit(1);
      }
    })
  }

  backup_env_keys() {
    console.log(`Auth linha 44`);
    process.env.TEMP_AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID; 
    process.env.TEMP_AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
    if (process.env.AWS_SESSION_TOKEN) {
      console.log(`Auth linha 48`);
      process.env.TEMP_AWS_SESSION_TOKEN = process.env.AWS_SESSION_TOKEN;
    } 
  }

  replace_env_keys() {
    console.log(`Auth linha 54`);
    process.env.AWS_ACCESS_KEY_ID = this.access_id;
    process.env.AWS_SECRET_ACCESS_KEY = this.secret_key;
    if (this.session_token) {
      console.log(`Auth linha 58`);
      process.env.AWS_SESSION_TOKEN = this.session_token;
    } else {
      console.log(`Auth linha 61`);
      process.env.AWS_SESSION_TOKEN = null
    }
  }

  login(role, roleSessionName, externalId) {
    console.log(`Auth linha 67`);
    return new Promise((resolve, reject) => {
      console.log(`Auth linha 69`);
      if (!this.connection) {
        console.log(`Auth linha 71`);
        if (role) {
          console.log(`Auth linha 73`);
          this.assumeRoleLogin(role, roleSessionName, externalId).then(() => {
            console.log(`Auth linha 75`);
            this.connection = AWS;
            resolve(this.connection);
          })
        } else {
          console.log(`Auth linha 80`);
          this.backup_env_keys();
          this.replace_env_keys();
          this.connection = AWS;
          resolve(this.connection);
        }
      } else {
        console.log(`Auth linha 87`);
        resolve(this.connection);
     }
    })
  }

  logout() {
    process.env.AWS_ACCESS_KEY_ID = process.env.TEMP_AWS_ACCESS_KEY_ID;
    process.env.AWS_SECRET_ACCESS_KEY = process.env.TEMP_AWS_SECRET_ACCESS_KEY;
    process.env.TEMP_AWS_ACCESS_KEY_ID = null; 
    process.env.TEMP_AWS_SECRET_ACCESS_KEY = null;
    if (process.env.TEMP_AWS_SESSION_TOKEN) {
      process.env.AWS_SESSION_TOKEN = process.env.TEMP_AWS_SESSION_TOKEN;
      process.env.TEMP_AWS_SESSION_TOKEN = null;
    }
  }
};

module.exports = Authentication;