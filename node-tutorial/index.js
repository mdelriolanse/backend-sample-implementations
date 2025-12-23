const { EventEmitter } = require('events');
const { readFile, readFileSync } = require('fs');

const eventEmitter = new EventEmitter();

// BLOCKING
// const txt = readFileSync('./hello.txt', 'utf-8')
// console.log(txt)

// NON BLOCKING
readFile('./hello.txt', 'utf-8', (err, txt) => {
    console.log(txt);
})

console.log("DO THIS ASAP")

process.on('lunch', () => {
    console.log('yum');
})

eventEmitter.emit('lunch');
process.emit('lunch')