const crypto = require('crypto');
console.log('Your JWT Secret Key:');
console.log(crypto.randomBytes(64).toString('hex'));
