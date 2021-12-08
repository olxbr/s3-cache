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
      console.log('Auth linha 17');
      client.assumeRole(params).then(data => {
        console.log(data);
        this.access_id = data.Credentials.AccessKeyId;
        this.secret_key = data.Credentials.SecretAccessKey;
        this.session_token = data.Credentials.SessionToken;
        this.replace_env_keys();
        console.log('Auth linha 17');
        resolve()
      })
    } catch (error) {
      console.log('Auth linha 24');
      console.log(error);
      console.log(`Error on client.assumeRole with params ${params}`)
      process.exit(1);
    }
  })
}

  backup_env_keys() {
    console.log('Auth linha 29')
    process.env.TEMP_AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID; 
    process.env.TEMP_AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
  }

  replace_env_keys() {
    console.log('Auth linha 35')
    process.env.AWS_ACCESS_KEY_ID = this.access_id;
    process.env.AWS_SECRET_ACCESS_KEY = this.secret_key;
    if (this.session_token) {
      process.env.AWS_SESSION_TOKEN = this.session_token;
    }
  }

  login(role, roleSessionName, externalId) {
    return new Promise((resolve, reject) => {
      console.log('Auth linha 44')
      if (!this.connection) {
        console.log('Auth linha 46')
        this.backup_env_keys();
        this.replace_env_keys();
        if (role) {
          console.log('Auth linha 49')
          this.assumeRoleLogin(role, roleSessionName, externalId).then(() => {
            console.log('Auth linha 55')
            this.connection = AWS;
            resolve(this.connection);
          })
        } else {
          console.log('Auth linha 52')
          this.connection = AWS;
          resolve(this.connection);
        }
      } else {
       console.log('Auth linha 59')
       resolve(this.connection);
     }
    })
  }

  logout() {
    console.log('Auth linha 65')
    process.env.AWS_ACCESS_KEY_ID = process.env.TEMP_AWS_ACCESS_KEY_ID;
    process.env.AWS_SECRET_ACCESS_KEY = process.env.TEMP_AWS_SECRET_ACCESS_KEY;
    process.env.TEMP_AWS_ACCESS_KEY_ID = null; 
    process.env.TEMP_AWS_SECRET_ACCESS_KEY = null;
  }
};

module.exports = Authentication;