// Virtual Voice Assistant - Web Speech API (recognition + synthesis)

const micBtn = document.getElementById("mic");
const statusEl = document.getElementById("status");
const chatEl = document.getElementById("chat");
const textForm = document.getElementById("textForm");
const textInput = document.getElementById("textInput");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let listening = false;

const jokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "I would tell you a UDP joke, but you might not get it.",
  "There are 10 types of people: those who understand binary and those who don't.",
  "A SQL query walks into a bar, walks up to two tables and asks: can I join you?"
];

// ---------- UI helpers ----------
function addMessage(text, who) {
  const div = document.createElement("div");
  div.className = "msg " + who;
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-IN";
  utter.rate = 1;
  window.speechSynthesis.speak(utter);
}

function reply(text) {
  addMessage(text, "bot");
  speak(text);
}

// ---------- Command handling ----------
function stripPrefix(cmd, prefixes) {
  for (const p of prefixes) {
    if (cmd.startsWith(p)) return cmd.slice(p.length).trim();
  }
  return null;
}

function handleCommand(raw) {
  const cmd = raw.toLowerCase().trim();
  if (!cmd) return;
  addMessage(raw, "user");

  const sites = {
    youtube: "https://www.youtube.com",
    google: "https://www.google.com",
    github: "https://github.com",
    gmail: "https://mail.google.com",
    linkedin: "https://www.linkedin.com"
  };

  if (/^(hi|hello|hey)\b/.test(cmd)) {
    return reply("Hello! How can I help you today?");
  }
  if (cmd.includes("your name") || cmd.includes("who are you")) {
    return reply("I am your virtual voice assistant, built with JavaScript and the Web Speech API.");
  }
  if (cmd.includes("how are you")) {
    return reply("I am doing great. Thanks for asking!");
  }
  if (cmd.includes("time")) {
    const t = new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
    return reply("The time is " + t);
  }
  if (cmd.includes("date") || cmd.includes("today") || cmd.includes("day is it")) {
    const d = new Date().toLocaleDateString("en-IN", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
    return reply("Today is " + d);
  }
  if (cmd.includes("joke")) {
    return reply(jokes[Math.floor(Math.random() * jokes.length)]);
  }

  const playQuery = stripPrefix(cmd, ["play "]);
  if (playQuery) {
    const q = playQuery.replace(/ on youtube$/, "");
    reply("Playing " + q + " on YouTube");
    window.open("https://www.youtube.com/results?search_query=" + encodeURIComponent(q), "_blank");
    return;
  }

  const searchQuery = stripPrefix(cmd, ["search for ", "search ", "google "]);
  if (searchQuery) {
    reply("Searching for " + searchQuery);
    window.open("https://www.google.com/search?q=" + encodeURIComponent(searchQuery), "_blank");
    return;
  }

  const openTarget = stripPrefix(cmd, ["open "]);
  if (openTarget) {
    const key = Object.keys(sites).find(k => openTarget.includes(k));
    if (key) {
      reply("Opening " + key);
      window.open(sites[key], "_blank");
    } else {
      reply("I don't know that website yet. Try searching for it instead.");
    }
    return;
  }

  if (cmd === "stop" || cmd.includes("be quiet")) {
    window.speechSynthesis.cancel();
    return;
  }

  reply("Sorry, I did not understand that. You can say: search for something, open YouTube, or what is the time.");
}

// ---------- Speech recognition ----------
if (!SpeechRecognition) {
  statusEl.textContent = "Voice input is not supported in this browser. Use Chrome, or type below.";
  micBtn.disabled = true;
} else {
  recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    listening = true;
    micBtn.classList.add("listening");
    statusEl.textContent = "Listening...";
  };
  recognition.onend = () => {
    listening = false;
    micBtn.classList.remove("listening");
    statusEl.textContent = "Tap the mic and speak";
  };
  recognition.onresult = (event) => {
    handleCommand(event.results[0][0].transcript);
  };
  recognition.onerror = (event) => {
    if (event.error === "not-allowed") {
      statusEl.textContent = "Microphone permission denied. Allow it in browser settings.";
    } else if (event.error === "no-speech") {
      statusEl.textContent = "No speech detected. Try again.";
    } else {
      statusEl.textContent = "Error: " + event.error;
    }
  };

  micBtn.addEventListener("click", () => {
    if (listening) recognition.stop();
    else recognition.start();
  });
}

// Typed commands (fallback and testing)
textForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleCommand(textInput.value);
  textInput.value = "";
});

reply("Hi, I am ready. Tap the mic and say something.");
