# Virtual Voice Assistant

Browser-based voice assistant that listens to spoken commands and replies with speech.

## Tech Stack
HTML, CSS, JavaScript, Web Speech API (`SpeechRecognition` and `speechSynthesis`)

## Features
- Speech recognition for voice commands
- Text-to-speech responses
- Commands: time, date, open websites, Google search, YouTube search, jokes, greetings
- Typed-command fallback for browsers without speech recognition
- Responsive dark UI with a live listening indicator

## How it works
1. `SpeechRecognition` converts the microphone input to text.
2. `handleCommand()` in `script.js` matches the text against known commands.
3. The reply is shown in the chat box and spoken with `SpeechSynthesisUtterance`.

## Run
Open `index.html` in Google Chrome and allow microphone access.
(Microphone access works on `localhost` or HTTPS, e.g. GitHub Pages.)

## Live demo
After deploying on GitHub Pages, add the link here.

## Future improvements
- Weather and news commands through public APIs
- Hindi language support
- Command history stored in localStorage
