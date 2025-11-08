import { parentPort } from 'worker_threads';

const time = 3600000; // 1 hour

function sleep(ms) {
    return new Promise((res) => {
        setTimeout(res, ms);
    });
}

while(true) {
    await sleep(time);
    parentPort.postMessage("check!");
}
