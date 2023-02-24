import bot from "../assets/bot.svg";
import user from "../assets/user.svg";

const form = document.querySelector(".chatform");
const chatContainer = document.getElementById("chatContainer");
// const temperatureSlider = document.getElementById("temperature");
const instagram = document.getElementById("instagram");
const twitter = document.getElementById("twitter");
const promptList = document.getElementById("promptList");
// const model = document.getElementById("model");
const overlay = document.getElementById("overlayContent");
const save = document.querySelectorAll("#save");
let responses = [];
let loadInterval;

instagram.addEventListener("click", () => {
  window.open('https://instagram.com/a1mightynan');
});

twitter.addEventListener("click", () => {
  window.open('https://twitter.com/almightynan')
})
function loader(element) {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent.length > 3) {
      element.textContent = "";
    }
  }, 400);
}

async function addToPromptList(id) {
  const responseToSave = responses.find(response => response.id === id);
  const response = await fetch(`https://xylserver.onrender.com//prompt/savePrompt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ response: responseToSave.response, prompt: responseToSave.prompt}),
  });
  if (response.status === 200) {
    promptList.innerHTML += `<li>Q: ${responseToSave.prompt}<br> A: ${responseToSave.response}</li>`;
  }
}

(async function retrievePrompts() {
  const response = await fetch(`https://xylserver.onrender.com//prompt/savedPrompts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 200) {
    const json = await response.json();
    json.forEach((saved) => {
      promptList.innerHTML += `<li>Q: ${saved.prompt}<br> A: ${saved.response}</li>`;
    });
  }
})();

// deleteAll.addEventListener("click", async () => {
//   const response = await fetch(`https://xylserver.onrender.com//prompt/deleteAll`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   if (response.status === 200) {
//     promptList.innerHTML = "";
//   }
// });

document.addEventListener("click", saveListener);
function saveListener(e) {
  if (e.target && e.target.id == "save") {
    const parentWrapper = e.target.closest('.wrapper');
    const id = parentWrapper.querySelector('.message').id;
    addToPromptList(id);
  }
}

function typeText(element, text) {
  let i = 0;
  let typeInterval = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(typeInterval);
    }
  }, 20);
}

function getUniqueId() {
  const time = Date.now();
  const randomNum = Math.floor(Math.random() * 100000000);
  return `id-${time}-${randomNum}`;
}

function chatBubble(isAi, value, uniqueId) {
  return `
        <div class="wrapper ${isAi && "ai"}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? "bot" : "user"}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
                ${
                  isAi
                    ? ``
                    : ""
                }
            </div>
        </div>
            `;
}

const handleFormSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  chatContainer.innerHTML += chatBubble(false, data.get("prompt"));
  form.reset();
  const uniqueId = getUniqueId();
  chatContainer.innerHTML += chatBubble(true, " ", uniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  const messageDiv = document.getElementById(uniqueId);
  const temperature = 0.95;
  const prompt = data.get("prompt");
  

  loader(messageDiv);

  const response = await fetch("https://xylserver.onrender.com//chatbot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: data.get("prompt"),
      temperature: 0.95,
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = " ";
  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim()
    typeText(messageDiv, parsedData);
    console.log(data);
    responses.push({
      prompt: prompt,
      response: parsedData,
      id: uniqueId
    });
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong";
    alert(err);
  }
};

form.addEventListener("submit", handleFormSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleFormSubmit(e);
  }
});
