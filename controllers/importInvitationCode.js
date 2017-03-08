
const InvitationCode   = require('../proxy').InvitationCode;


const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('./code.txt')
});

rl.on('line', (code) => {
  InvitationCode.newAndSave(code);
});
console.log('数据读写成功');