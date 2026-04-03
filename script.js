function closeCrtModal() {
  document.getElementById('crtModal').classList.remove('active');
  sessionStorage.setItem('crt_warned', '1');
}

window.addEventListener('load', () => {
  if (window.innerWidth < 600 && !sessionStorage.getItem('crt_warned')) {
    document.getElementById('crtModal').classList.add('active');
  }

  setTimeout(() => {
    const input = document.getElementById('errorInput');
    if (!input.value) {
      document.getElementById('charHint').textContent =
        "You hesitate… I can feel it.";
    }
  }, 3000);
});

document.addEventListener('mousemove', (e) => {
  if (Math.random() > 0.7) {

    const sparkles = ['✨','💜','🌸','💫','⭐','💕','🦋'];
    const el = document.createElement('div');
    el.className = 'sparkle';
    el.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    el.style.left = e.clientX + 'px';
    el.style.top  = e.clientY + 'px';
    document.documentElement.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
});

(function animateCounter() {
  const el = document.getElementById('visitorNum');
  let current = 0;
  const target = 418;

  const weirdStates = [
    "000418",
    "999999",
    "ERROR",
    "???",
    "000001",
    "you again"
  ];

  const step = () => {
    if (Math.random() > 0.92) {
      el.textContent = weirdStates[Math.floor(Math.random() * weirdStates.length)];
      return;
    }

    current += Math.ceil((target - current) / 8);
    if (current >= target) {
      el.textContent = '000418';
      return;
    }

    el.textContent = String(current).padStart(6, '0');
    setTimeout(step, 60);
  };

  setTimeout(step, 800);
})();

document.getElementById('errorInput').addEventListener('input', function () {
  const n = this.value.length;

  const pain =
    n === 0  ? 'characters of pain' :
    n < 50   ? 'characters of mild discomfort' :
    n < 200  ? 'characters of genuine suffering' :
               'characters of EXISTENTIAL DESPAIR';

  document.getElementById('charHint').textContent = `${n} ${pain}`;
  document.getElementById('errorMsg').classList.remove('visible');
});

function is418(text) {
  return /418|teapot|i('m| am) a teapot|htcpcp/i.test(text);
}

function trigger418Easter() {
  const overlay = document.getElementById('teapotOverlay');
  overlay.classList.add('active');

  document.body.style.animation = 'shake 0.3s';
  setTimeout(() => (document.body.style.animation = ''), 1000);

  document.body.style.filter = 'hue-rotate(180deg) saturate(2)';

  const colors = ['#ff69b4', '#c084fc', '#f9a8d4', '#fbbf24', '#34d399', '#60a5fa'];
  const end = Date.now() + 4000;

  (function frame() {
    confetti({ particleCount: 10, angle: 60, spread: 60, origin: { x: 0 }, colors });
    confetti({ particleCount: 10, angle: 120, spread: 60, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  const title = document.getElementById('sonnetTitle');
  if (title) {
    title.textContent = "THE KETTLE HAS AWAKENED";
  }

  setTimeout(() => {
    overlay.classList.remove('active');
    document.body.style.filter = '';
  }, 5000);
}

// ==== FALLBACK POEM ===
const FALLBACK_POEM = `A Lament for the Overwhelmed Muse

The wires are crossed, the silicon starts to weep,
Too many souls have brought their grief today.
The Muse has fallen into troubled sleep,
And has no words of sorrow left to say.
Wait but a moment, let the buffer clear,
Thy error waits within the digital queue.
Return when silence findeth once more here,
And then the Muse shall sing again for you.
So close thy laptop, breathe the evening air,
Let coffee cool and keyboards sit in peace.
The Muse shall wake refreshed beyond compare,
And sorrows rendered verse shall find release.
  Return in sixty seconds, weary friend,
  The Muse shall meet thee ere this silence ends.

~ Please wait 60 seconds for the Muse to recover ~`;

async function fetchPoem(errorText) {
  const res = await fetch('/api/poem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ errorText })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong. Even the server is grieving.');
  }

  return data.poem;
}

let inflight = false;
let submissions = 0;

async function handleSubmit() {
  if (inflight) return;

  const errorText = document.getElementById('errorInput').value.trim();

  if (!errorText) {
    showError('Silence… even thy suffering refuseth to speak');
    return;
  }

  submissions++;

  
  if (submissions === 3) {
    showError("Again? Thou art persistent in suffering.");
    return;
  }

  if (submissions === 5) {
    document.body.style.filter = "hue-rotate(90deg)";
  }

  if (is418(errorText)) trigger418Easter();

  inflight = true;
  setLoading(true);

  try {
    const poem = await fetchPoem(errorText);
    renderSonnet(poem, errorText);
  } catch {
    renderSonnet(FALLBACK_POEM, errorText);
  } finally {
    inflight = false;
    setLoading(false);
  }
}

function setLoading(on) {
  const btn = document.getElementById('submitBtn');
  btn.disabled = on;

  if (on) {
    btn.textContent = "💔 Why would you do this to me? 💔";
  } else {
    btn.textContent = "💔 Translate My Suffering Into Poetry 💔";
  }

  document.getElementById('loadingArea').classList.toggle('active', on);

  if (on) {
    document.getElementById('sonnetArea').classList.remove('visible');
  }
}

function showError(msg) {
  const el = document.getElementById('errorMsg');
  el.textContent = msg;
  el.classList.add('visible');
}

function renderSonnet(poem, errorText) {
  const lines = poem.trim().split('\n').filter(l => l.trim());

  const title = lines[0] || 'A Lament Most Dire';
  const body  = lines.slice(1).join('\n').trim();

  document.getElementById('sonnetTitle').textContent = title;
  document.getElementById('sonnetText').textContent  = body;

  const badge = errorText.split('\n')[0].slice(0, 60);
  document.getElementById('errorBadge').textContent =
    badge + (badge.length >= 60 ? '…' : '');

  document.getElementById('sonnetArea').classList.add('visible');
  document.getElementById('sonnetArea').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ff69b4', '#c084fc', '#f9a8d4', '#fbbf24', '#60a5fa']
  });
}

function resetForm() {
  document.getElementById('errorInput').value = '';
  document.getElementById('charHint').textContent = '0 characters of pain';
  document.getElementById('sonnetArea').classList.remove('visible');
  document.getElementById('errorMsg').classList.remove('visible');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}