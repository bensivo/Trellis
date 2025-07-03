var counter = 0;

const counterElement = document.getElementById('counter');

async function sendPing() {
    console.log("sending ping...");
    const response = await window.electron.ping(counter++);
    console.log("response", response);

    counter = response;
    counterElement.innerText = response;

}
const pingBtn = document.getElementById('ping-btn');
pingBtn.addEventListener('click', sendPing);

