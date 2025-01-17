const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");

// let's store all current messages here
let allChat = [];

// the interval to poll at in milliseconds
const INTERVAL = 3000;

// a submit listener on the form in the HTML
chat.addEventListener("submit", function (e) {
  e.preventDefault();
  // post Message function
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  // post to /poll a new message
  // write code here
  return fetch('/poll',{
    method: "POST",
    body: JSON.stringify({user, text}),
    headers:{
      'Content-Type':'application/json'
    }
  })
}

async function getNewMsgs() {
  // poll the server
  // write code here
  let json;
  try {
    const res = await fetch("/poll");
    json = await res.json()
  }
  catch(err){
    // Backoff code
    console.error("Poll error", err)
  }
  allChat = json.msg;
  render();
  // Recursive code
  // setTimeout(getNewMsgs, INTERVAL);
}

function render() {
  // as long as allChat is holding all current messages, this will render them
  // into the ui. yes, it's inefficent. yes, it's fine for this example
  const html = allChat.map(({ user, text, time, id }) =>
    template(user, text, time, id)
  );
  msgs.innerHTML = html.join("\n");
}

// given a user and a msg, it returns an HTML string to render to the UI
const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

let timeToMakeNextRequest = 0;
async function rafTimer(time){
  if(timeToMakeNextRequest <= time){
    await getNewMsgs()
    timeToMakeNextRequest = time + INTERVAL;
  }
  requestAnimationFrame(rafTimer)
}
// Call when page loads
// This function is getting called 1000's of time so make sure you don't do heavy computation inside it
requestAnimationFrame(rafTimer)
