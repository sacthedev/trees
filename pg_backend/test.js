// 2021-04-11 11:41:24.090049-04
let time = new Date(Date.now()).toISOString().replace(/T|Z/gi, ' ');
time = time.substr(0, time.length-1) + '-04';

console.log(time);
