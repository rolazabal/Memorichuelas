import { parentPort } from 'worker_threads';

const sleepSeconds = 60;

function sleep(s) {
    let mstos = 1000;
    return new Promise((res) => {
        setTimeout(res, s * mstos);
    });
}

while(true) {
    await sleep(sleepSeconds);
    parentPort.postMessage("check!");
}