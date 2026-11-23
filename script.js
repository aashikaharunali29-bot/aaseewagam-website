const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');

menuBtn.addEventListener('click', () => {
  const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!isOpen));
  menuBtn.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navMenu.classList.toggle('active', !isOpen);
});

navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navMenu.classList.remove('active');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Open navigation');
}));

const chatToggle = document.getElementById('chatToggle');
const chatBox = document.getElementById('chatBox');
const closeChat = document.getElementById('closeChat');
const chatBody = document.getElementById('chatBody');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

function setChatOpen(open) {
  chatBox.classList.toggle('open', open);
  chatBox.setAttribute('aria-hidden', String(!open));
  chatToggle.setAttribute('aria-expanded', String(open));
  if (open) chatInput.focus();
}

chatToggle.addEventListener('click', () => setChatOpen(!chatBox.classList.contains('open')));
closeChat.addEventListener('click', () => setChatOpen(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && chatBox.classList.contains('open')) setChatOpen(false);
});

function addMessage(text, type) {
  const message = document.createElement('p');
  message.className = `${type}-message`;
  message.textContent = text;
  chatBody.appendChild(message);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function getReply(message) {
  const text = message.toLowerCase();
  if (text.includes('crm') || text.includes('customer') || text.includes('lead')) {
    return 'Our CRM brings contacts, conversations, and deal tracking into one clear workspace. You can capture leads, assign follow-ups, and see your pipeline at a glance.';
  }
  if (text.includes('ai') || text.includes('bot') || text.includes('chat')) {
    return 'The AI assistant can answer common questions, qualify incoming leads, and route conversations to the right teammate. It is available around the clock.';
  }
  if (text.includes('sales') || text.includes('pipeline') || text.includes('deal')) {
    return 'The sales workspace helps your team track every opportunity, prioritize next steps, and understand pipeline performance. Would you like to see a demo?';
  }
  if (text.includes('price') || text.includes('cost') || text.includes('plan')) {
    return 'Plans depend on your team and the tools you need. Share a few details with our team at hello@aaseewagam.com and we can recommend a good fit.';
  }
  if (text.includes('demo') || text.includes('meeting') || text.includes('call')) {
    window.setTimeout(() => showLeadForm(), 250);
    return 'Happy to help you arrange a demo. What is the best email address to reach you?';
  }
  if (text.includes('@') && text.includes('.')) {
    window.setTimeout(() => addMessage('Thanks! In the live version, your demo request would be sent to our team. For now, you can also email hello@aaseewagam.com.', 'bot'), 250);
    return 'I have your email. What would you most like to see in the demo: CRM, sales pipeline, or AI assistant?';
  }
  return 'Thanks for reaching out! I can tell you about our CRM, sales tools, AI assistant, and workflow automation. What would you like to explore?';
}

function showLeadForm() {
  if (document.getElementById('leadCapture')) return;
  const form = document.createElement('form');
  form.id = 'leadCapture';
  form.className = 'lead-capture';
  form.innerHTML = '<label for="leadEmail">Get in touch about a demo</label><div><input id="leadEmail" type="email" placeholder="you@company.com" required><button type="submit" aria-label="Save email">→</button></div><small>Demo only. This form does not send or store your details.</small>';
  chatBody.appendChild(form);
  chatBody.scrollTop = chatBody.scrollHeight;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const email = form.querySelector('input').value;
    form.remove();
    addMessage(`Thanks! Your demo interest is noted for ${email}. In the live version, this would be sent to our team.`, 'bot');
  });
}

function sendMessage(text) {
  const message = text.trim();
  if (!message) return;
  addMessage(message, 'user');
  const typing = document.createElement('p');
  typing.className = 'bot-message chat-typing';
  typing.setAttribute('aria-label', 'Assistant is typing');
  typing.innerHTML = '<i></i><i></i><i></i>';
  chatBody.appendChild(typing);
  chatBody.scrollTop = chatBody.scrollHeight;
  window.setTimeout(() => {
    typing.remove();
    addMessage(getReply(message), 'bot');
  }, 650);
}

chatForm.addEventListener('submit', event => {
  event.preventDefault();
  sendMessage(chatInput.value);
  chatInput.value = '';
});

chatBody.querySelectorAll('[data-prompt]').forEach(button => {
  button.addEventListener('click', () => sendMessage(button.dataset.prompt));
});

const ticketForm = document.getElementById('ticketForm');
const ticketSuccess = document.getElementById('ticketSuccess');
ticketForm.addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(ticketForm);
  const ticketNumber = `DEMO-${Math.floor(10000 + Math.random() * 90000)}`;
  ticketSuccess.textContent = `Thanks, ${formData.get('name')}. Your demo ticket ${ticketNumber} is ready. Connect this form to a support service to deliver it to your team.`;
  ticketSuccess.hidden = false;
  ticketSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  ticketForm.reset();
});

const playDemo = document.getElementById('playDemo');
const videoPlayButton = document.getElementById('videoPlayButton');
const videoFrame = document.getElementById('videoFrame');
const videoCaption = document.getElementById('videoCaption');
const videoProgress = document.getElementById('videoProgress');
const tourScenes = [
  { caption: 'A clear view of your sales pipeline', progress: 17 },
  { caption: 'Every customer detail, right where you need it', progress: 38 },
  { caption: 'An AI assistant that helps qualify new leads', progress: 62 },
  { caption: 'Automated follow-ups keep opportunities moving', progress: 83 },
  { caption: 'One connected workspace. More room to grow.', progress: 100 }
];
let tourTimer;
let tourIndex = 0;
function toggleTour() {
  const isPlaying = videoFrame.classList.toggle('playing');
  videoPlayButton.textContent = isPlaying ? 'Ⅱ' : '▶';
  videoPlayButton.setAttribute('aria-label', isPlaying ? 'Pause product tour' : 'Play product tour');
  playDemo.textContent = isPlaying ? 'Pause product tour' : '▶  Play product tour';
  window.clearInterval(tourTimer);
  if (isPlaying) {
    tourTimer = window.setInterval(() => {
      const scene = tourScenes[tourIndex % tourScenes.length];
      videoCaption.textContent = scene.caption;
      videoProgress.style.width = `${scene.progress}%`;
      tourIndex += 1;
      if (tourIndex >= tourScenes.length) {
        window.clearInterval(tourTimer);
        videoFrame.classList.remove('playing');
        videoPlayButton.textContent = '▶';
        videoPlayButton.setAttribute('aria-label', 'Replay product tour');
        playDemo.textContent = '▶  Replay product tour';
        tourIndex = 0;
      }
    }, 1500);
  }
}
playDemo.addEventListener('click', toggleTour);
videoPlayButton.addEventListener('click', toggleTour);
