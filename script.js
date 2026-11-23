const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');

// Reveal sections as they enter view and show reading progress.
document.body.classList.add('reveal-ready');
const revealTargets = document.querySelectorAll('.hero-copy, .dashboard-wrap, .hero-foot, .tool-logos, .section-heading, .platform-card, .solutions-copy, .people-visual, .people-copy, .demo-copy, .video-frame, .stories-heading, .support-intro, .ticket-form, .why-inner > div, .contact-card');
revealTargets.forEach((element, index) => {
  element.classList.add('reveal');
  if (element.matches('.platform-card')) {
    element.classList.add(`reveal-delay-${(index % 4) + 1}`);
  }
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    entry.target.classList.toggle('is-visible', entry.isIntersecting);
  });
}, { threshold: 0.12 });
revealTargets.forEach(element => revealObserver.observe(element));

// Keep decorative animation active only while its section is on screen.
const motionSections = document.querySelectorAll('.hero, .logo-strip, .platform, .solutions, .people-section, .why-us, .stories, .support, .contact');
const motionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    entry.target.classList.toggle('motion-active', entry.isIntersecting);
    if (entry.target.matches('.stories')) {
      if (entry.isIntersecting) startStoryRotation();
      else stopStoryRotation();
    }
    if (entry.target.matches('.solutions')) {
      if (entry.isIntersecting) startJourneySequence();
      else stopJourneySequence();
    }
  });
}, { threshold: 0.08 });
motionSections.forEach(section => motionObserver.observe(section));

const journeyRows = Array.from(document.querySelectorAll('.journey-list article'));
let journeyTimer;
let activeJourneyIndex = -1;

function startJourneySequence() {
  if (journeyTimer || journeyRows.length === 0) return;
  journeyRows.forEach(row => row.classList.remove('journey-visible', 'journey-active'));
  activeJourneyIndex = 0;
  journeyRows[0].classList.add('journey-visible', 'journey-active');
  journeyTimer = window.setInterval(() => {
    const nextIndex = activeJourneyIndex + 1;
    if (nextIndex >= journeyRows.length) {
      window.clearInterval(journeyTimer);
      journeyTimer = undefined;
      return;
    }
    journeyRows[activeJourneyIndex].classList.remove('journey-active');
    activeJourneyIndex = nextIndex;
    journeyRows[activeJourneyIndex].classList.add('journey-visible', 'journey-active');
  }, 1000);
}

function stopJourneySequence() {
  window.clearInterval(journeyTimer);
  journeyTimer = undefined;
  activeJourneyIndex = -1;
  journeyRows.forEach(row => row.classList.remove('journey-visible', 'journey-active'));
}
const demoSection = document.querySelector('.demo-section');
motionObserver.observe(demoSection);

let scrollMotionTimer;
window.addEventListener('scroll', () => {
  document.body.classList.add('is-scrolling');
  window.clearTimeout(scrollMotionTimer);
  scrollMotionTimer = window.setTimeout(() => document.body.classList.remove('is-scrolling'), 850);
}, { passive: true });

const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
document.body.appendChild(scrollProgress);
function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

// Small pointer tilt adds depth to the dashboard on desktop without affecting touch layouts.
const dashboardWrap = document.querySelector('.dashboard-wrap');
const dashboardCard = document.querySelector('.dashboard-card');
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const prefersLessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (canHover && !prefersLessMotion) {
  dashboardWrap.addEventListener('pointermove', event => {
    const bounds = dashboardWrap.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    dashboardWrap.style.setProperty('--pointer-x', `${(x + 0.5) * 100}%`);
    dashboardWrap.style.setProperty('--pointer-y', `${(y + 0.5) * 100}%`);
    dashboardCard.style.transform = `rotate(-1deg) rotateY(${x * 5}deg) rotateX(${y * -5}deg) translateY(-3px)`;
  });
  dashboardWrap.addEventListener('pointerleave', () => {
    dashboardCard.style.transform = '';
    dashboardWrap.style.setProperty('--pointer-x', '50%');
    dashboardWrap.style.setProperty('--pointer-y', '50%');
  });
}

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
  chatToggle.classList.toggle('chat-open', open);
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
  { tab: 'CRM', caption: 'Capture a lead and keep every customer detail in one place.', title: 'Your customer workspace', subtitle: 'Eight new opportunities are ready for your team.', metrics: [['Pipeline', '$248,650'], ['New leads', '1,284'], ['Deals won', '36']], chart: 'Sales pipeline', toast: ['CRM update', 'Customer record is up to date'] },
  { tab: 'AI assistant', caption: 'Let AI answer common questions and qualify new leads.', title: 'Meet your AI teammate', subtitle: 'New conversations are being answered around the clock.', metrics: [['Answered', '98%'], ['Available', '24/7'], ['Reply time', '4.2s']], chart: 'Conversations handled', toast: ['AI assistant', 'Lead qualified and assigned'] },
  { tab: 'Automation', caption: 'Send timely follow-ups and assign the next step automatically.', title: 'Work that moves itself', subtitle: 'Three helpful steps run when a new lead arrives.', metrics: [['Tasks saved', '12,480'], ['On time', '86%'], ['Workflows', '12']], chart: 'Workflow activity', toast: ['Follow-up sent', 'Next step assigned automatically'] }
];
let tourTimer;
let tourIndex = 0;
const tourTabs = Array.from(document.querySelectorAll('.tour-tab'));
function showTourScene(index) {
  const scene = tourScenes[index];
  const greeting = videoFrame.querySelector('.video-greeting');
  const greetingSmall = greeting.querySelector('small');
  const stats = Array.from(videoFrame.querySelectorAll('.video-stats > div'));
  const chartTitle = videoFrame.querySelector('.video-chart > span');
  const toast = videoFrame.querySelector('.video-toast');
  greeting.firstChild.textContent = scene.title;
  greetingSmall.textContent = scene.subtitle;
  stats.forEach((stat, metricIndex) => {
    stat.querySelector('small').textContent = scene.metrics[metricIndex][0];
    stat.querySelector('b').textContent = scene.metrics[metricIndex][1];
  });
  chartTitle.textContent = scene.chart;
  toast.querySelector('b').textContent = scene.toast[0];
  toast.querySelector('small').textContent = scene.toast[1];
  videoCaption.textContent = scene.caption;
  videoProgress.style.width = `${Math.round(((index + 1) / tourScenes.length) * 100)}%`;
  tourTabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.classList.toggle('is-active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
  tourIndex = index;
}
tourTabs.forEach((tab, index) => tab.addEventListener('click', () => {
  window.clearInterval(tourTimer);
  tourTimer = undefined;
  videoFrame.classList.remove('playing');
  videoPlayButton.textContent = '▶';
  videoPlayButton.setAttribute('aria-label', 'Play product tour');
  playDemo.innerHTML = '<span class="play-icon">▶</span> Play product tour';
  showTourScene(index);
}));
showTourScene(0);
function toggleTour() {
  const isPlaying = videoFrame.classList.toggle('playing');
  videoPlayButton.textContent = isPlaying ? 'Ⅱ' : '▶';
  videoPlayButton.setAttribute('aria-label', isPlaying ? 'Pause product tour' : 'Play product tour');
  playDemo.innerHTML = isPlaying ? 'Pause product tour' : '<span class="play-icon">▶</span> Play product tour';
  window.clearInterval(tourTimer);
  if (isPlaying) {
    if (tourIndex >= tourScenes.length - 1) showTourScene(0);
    tourTimer = window.setInterval(() => {
      const nextIndex = tourIndex + 1;
      if (nextIndex >= tourScenes.length) {
        window.clearInterval(tourTimer);
        tourTimer = undefined;
        videoFrame.classList.remove('playing');
        videoPlayButton.textContent = '▶';
        videoPlayButton.setAttribute('aria-label', 'Replay product tour');
        playDemo.innerHTML = '<span class="play-icon">▶</span> Replay product tour';
        return;
      }
      showTourScene(nextIndex);
    }, 2200);
  }
}
playDemo.addEventListener('click', toggleTour);
videoPlayButton.addEventListener('click', toggleTour);

const storyTrack = document.getElementById('storyTrack');
const storySlides = Array.from(storyTrack.children);
const storyCarousel = document.querySelector('.story-carousel');
let activeStoryIndex = 0;
let storyTimer;

storySlides[0].classList.add('story-current');
storySlides.forEach((slide, index) => slide.setAttribute('aria-hidden', String(index !== 0)));

function advanceStory(indexDirection = 1, visualDirection = -1) {
  const previousSlide = storySlides[activeStoryIndex];
  previousSlide.classList.remove('story-current');
  previousSlide.classList.remove('story-exit-left', 'story-exit-right');
  const exitClass = visualDirection < 0 ? 'story-exit-left' : 'story-exit-right';
  const enterClass = visualDirection < 0 ? 'story-enter-right' : 'story-enter-left';
  previousSlide.classList.add(exitClass);
  previousSlide.setAttribute('aria-hidden', 'true');
  activeStoryIndex = (activeStoryIndex + indexDirection + storySlides.length) % storySlides.length;
  const nextSlide = storySlides[activeStoryIndex];
  nextSlide.classList.remove('story-exit-left', 'story-exit-right', 'story-enter-left', 'story-enter-right');
  nextSlide.classList.add(enterClass);
  nextSlide.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => {
    nextSlide.classList.remove(enterClass);
    nextSlide.classList.add('story-current');
  });
  window.setTimeout(() => previousSlide.classList.remove(exitClass), 800);
}

function moveStoryManually(indexDirection, visualDirection) {
  stopStoryRotation();
  advanceStory(indexDirection, visualDirection);
  storyTimer = window.setInterval(advanceStory, 2100);
}

document.getElementById('storyPrev').addEventListener('click', () => moveStoryManually(-1, -1));
document.getElementById('storyNext').addEventListener('click', () => moveStoryManually(1, 1));

function startStoryRotation() {
  if (storyTimer || !storyCarousel.closest('.stories').classList.contains('motion-active')) return;
  storyTimer = window.setInterval(advanceStory, 2100);
}

function stopStoryRotation() {
  window.clearInterval(storyTimer);
  storyTimer = undefined;
}

startStoryRotation();
