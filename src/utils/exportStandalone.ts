import { SENTENCES } from '../data/sentences';

/**
 * Builds and downloads a completely self-contained, single-file HTML version
 * of the application that works offline on any phone, tablet, or PC without node or web server.
 */
export function exportStandaloneHTML() {
  const sentencesJson = JSON.stringify(SENTENCES, null, 2);

  const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#072e59">
  <title>تَحَدِّي الْجُمَلِ الْقِرَائِيَّةِ — مدارس قرطبة</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800;900&family=Noto+Naskh+Arabic:wght@600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --ink: #0c1e4a;
      --blue: #0284c7;
      --turquoise: #0891b2;
      --olive: #4d7c0f;
      --accent: #dc2626;
      --gold: #ea580c;
      --bg: #0891b2;
      --success: #16a34a;
      --error: #dc2626;
      font-family: 'Noto Naskh Arabic', 'Cairo', Tahoma, system-ui, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: linear-gradient(135deg, #0891b2 0%, #0e7490 25%, #15803d 70%, #3f6212 100%); color: var(--ink); min-height: 100vh; padding: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; background-attachment: fixed; }
    .board-container { width: 100%; max-width: 960px; background: rgba(255,255,255,0.98); border-radius: 28px; padding: 1.5rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); border: 4px solid #67e8f9; }
    .header-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 1rem; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.25rem; }
    .stat-card { border-radius: 16px; padding: 0.75rem; text-align: center; border: 2px solid; }
    .stat-score { background: #fffbeb; border-color: #fde68a; color: #78350f; }
    .stat-time { background: #eff6ff; border-color: #bfdbfe; color: #1e3a8a; }
    .stat-progress { background: #ecfdf5; border-color: #a7f3d0; color: #064e3b; }
    .stat-val { font-size: 1.75rem; font-weight: 900; }
    .sentence-card { background: #ffffff; border-radius: 24px; border: 3px solid #bfdbfe; padding: 1.5rem; text-align: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); margin-bottom: 1.25rem; transition: all 0.25s; }
    .sentence-card.correct { border-color: var(--success); box-shadow: 0 0 20px rgba(22,163,74,0.3); }
    .sentence-card.wrong { border-color: var(--error); animation: shake 0.3s; }
    .pic-box { width: 85px; height: 85px; border-radius: 20px; border: 3px dashed #f59e0b; background: #fffbeb; display: inline-flex; align-items: center; justify-content: center; font-size: 3rem; margin-bottom: 1rem; }
    .placed-area { min-height: 80px; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 18px; padding: 0.75rem; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; }
    .token-btn { font-family: inherit; font-size: 1.5rem; font-weight: 700; padding: 0.6rem 1.4rem; border-radius: 16px; border: 2px solid; border-bottom-width: 5px; cursor: pointer; transition: all 0.15s; background: #ffffff; }
    .token-btn:hover { transform: translateY(-2px); }
    .token-btn:active { transform: translateY(2px); border-bottom-width: 2px; }
    .controls { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; margin-top: 1rem; }
    .btn { font-family: inherit; font-size: 1rem; font-weight: 800; padding: 0.7rem 1.5rem; border-radius: 14px; border: none; cursor: pointer; transition: all 0.2s; }
    .btn-primary { background: #16a34a; color: white; border-bottom: 4px solid #14532d; }
    .btn-secondary { background: #e2e8f0; color: #1e293b; border-bottom: 4px solid #94a3b8; }
    .btn-skip { background: #eff6ff; color: #075694; border: 2px solid #bfdbfe; border-bottom: 4px solid #93c5fd; }
    .footer-bar { border-top: 2px solid #e2e8f0; margin-top: 1.5rem; padding-top: 0.75rem; text-align: center; font-size: 0.85rem; font-weight: 700; color: #475569; }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  </style>
</head>
<body>
  <main class="board-container">
    <header class="header-bar">
      <div>
        <h1 style="font-size: 1.4rem; font-weight: 900; color: var(--ink);">تَحَدِّي الْجُمَلِ الْقِرَائِيَّةِ</h1>
        <p style="font-size: 0.85rem; color: var(--blue); font-weight: 700;">مدارس قرطبة — إعداد: أ. أحمد الشربيني</p>
      </div>
      <div>
        <button id="mode-btn" class="btn btn-secondary" onclick="toggleMode()">تغيير الوضع ⏱️</button>
      </div>
    </header>

    <div class="stats-grid">
      <div class="stat-card stat-score">
        <div style="font-size: 0.8rem; font-weight: 800;">النقاط</div>
        <div id="score-val" class="stat-val">0</div>
      </div>
      <div class="stat-card stat-time">
        <div style="font-size: 0.8rem; font-weight: 800;">الوقت</div>
        <div id="time-val" class="stat-val">90ث</div>
      </div>
      <div class="stat-card stat-progress">
        <div style="font-size: 0.8rem; font-weight: 800;">التقدم</div>
        <div id="progress-val" class="stat-val">1/100</div>
      </div>
    </div>

    <section id="sentence-card" class="sentence-card">
      <div id="pic-box" class="pic-box">📖</div>
      <div id="placed-area" class="placed-area"></div>
      <p id="feedback-msg" style="font-weight: 800; font-size: 1rem;"></p>
    </section>

    <section id="tokens-area" style="text-align: center; margin-bottom: 1rem;">
      <div id="tokens-list" style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;"></div>
    </section>

    <div class="controls">
      <button id="start-btn" class="btn btn-primary" onclick="toggleGame()">ابدأ التحدي 🚀</button>
      <button class="btn btn-secondary" onclick="resetCurrentSentence()">إعادة 🔄</button>
      <button class="btn btn-skip" onclick="skipSentence()">تخطّي ⏭️</button>
      <button class="btn btn-secondary" onclick="speakCurrentSentence()">استمع 🔊</button>
    </div>

    <footer class="footer-bar">
      مدارس قرطبة الأهلية — تصميم وإعداد: أ. أحمد الشربيني، مشرف الصفوف الأولية
    </footer>
  </main>

  <script>
    const SENTENCES = ${sentencesJson};
    let currentIdx = 0;
    let score = 0;
    let timeLeft = 90;
    let timerId = null;
    let isRunning = false;
    let mode = 'challenge';
    let placedTokens = [];
    let remainingTokens = [];

    const audioCtx = window.AudioContext ? new AudioContext() : null;
    function playBeep(freq, duration) {
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch(e) {}
    }

    function shuffle(arr) {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    function initSentence() {
      const s = SENTENCES[currentIdx];
      document.getElementById('pic-box').textContent = s.picture;
      document.getElementById('progress-val').textContent = (currentIdx + 1) + '/100';
      placedTokens = [];
      remainingTokens = shuffle(s.tokens);
      render();
    }

    function render() {
      const s = SENTENCES[currentIdx];
      const placedArea = document.getElementById('placed-area');
      placedArea.innerHTML = '';
      if (placedTokens.length === 0) {
        placedArea.innerHTML = '<span style="color:#94a3b8;font-weight:700;">اضغط على المقاطع بالترتيب الصحيح</span>';
      } else {
        placedTokens.forEach((t, i) => {
          const btn = document.createElement('button');
          btn.className = 'token-btn';
          btn.textContent = t;
          btn.style.color = i === 0 ? '#bd080b' : (i === 1 ? '#075694' : '#df7200');
          btn.style.borderColor = btn.style.color;
          btn.onclick = () => removePlaced(i);
          placedArea.appendChild(btn);
        });
        const dot = document.createElement('span');
        dot.style.fontSize = '2rem';
        dot.style.fontWeight = 'bold';
        dot.textContent = '.';
        placedArea.appendChild(dot);
      }

      const tokensList = document.getElementById('tokens-list');
      tokensList.innerHTML = '';
      remainingTokens.forEach((t, i) => {
        const btn = document.createElement('button');
        btn.className = 'token-btn';
        btn.textContent = t;
        btn.onclick = () => selectToken(i);
        tokensList.appendChild(btn);
      });
    }

    function selectToken(idx) {
      const token = remainingTokens.splice(idx, 1)[0];
      placedTokens.push(token);
      playBeep(440, 0.08);
      render();
      checkCompletion();
    }

    function removePlaced(idx) {
      const token = placedTokens.splice(idx, 1)[0];
      remainingTokens.push(token);
      playBeep(350, 0.08);
      render();
    }

    function checkCompletion() {
      const s = SENTENCES[currentIdx];
      if (placedTokens.length === s.tokens.length) {
        const isMatch = placedTokens.every((t, i) => t === s.tokens[i]);
        const card = document.getElementById('sentence-card');
        const feedback = document.getElementById('feedback-msg');
        if (isMatch) {
          score += 10;
          document.getElementById('score-val').textContent = score;
          card.classList.add('correct');
          feedback.textContent = '🌟 ممتاز! إجابة صحيحة (+10)';
          feedback.style.color = '#16a34a';
          playBeep(650, 0.25);
          setTimeout(() => {
            card.classList.remove('correct');
            feedback.textContent = '';
            if (currentIdx < SENTENCES.length - 1) {
              currentIdx++;
              initSentence();
            } else {
              alert('مبروك! أنهيت جميع الجمل بنتيجة: ' + score);
            }
          }, 800);
        } else {
          score = Math.max(0, score - 2);
          document.getElementById('score-val').textContent = score;
          card.classList.add('wrong');
          feedback.textContent = '🔄 حاول مرة أخرى (-2)';
          feedback.style.color = '#dc2626';
          playBeep(220, 0.25);
          setTimeout(() => {
            card.classList.remove('wrong');
            feedback.textContent = '';
            resetCurrentSentence();
          }, 900);
        }
      }
    }

    function resetCurrentSentence() {
      placedTokens = [];
      remainingTokens = shuffle(SENTENCES[currentIdx].tokens);
      render();
    }

    function skipSentence() {
      if (currentIdx < SENTENCES.length - 1) {
        currentIdx++;
        initSentence();
      }
    }

    function toggleGame() {
      isRunning = !isRunning;
      const btn = document.getElementById('start-btn');
      if (isRunning) {
        btn.textContent = 'إيقاف مؤقت ⏸️';
        if (mode === 'challenge' && !timerId) {
          timerId = setInterval(() => {
            timeLeft--;
            document.getElementById('time-val').textContent = timeLeft + 'ث';
            if (timeLeft <= 0) {
              clearInterval(timerId);
              timerId = null;
              isRunning = false;
              btn.textContent = 'ابدأ التحدي 🚀';
              alert('انتهى الوقت! نتيجتك النهائية: ' + score);
            }
          }, 1000);
        }
      } else {
        btn.textContent = 'استئناف 🚀';
        if (timerId) { clearInterval(timerId); timerId = null; }
      }
    }

    function toggleMode() {
      if (mode === 'challenge') {
        mode = 'accuracy';
        document.getElementById('mode-btn').textContent = 'تحدي الوقت المفتوح (دقة) 🎯';
        document.getElementById('time-val').textContent = '🎯 دِقَّةٌ';
      } else if (mode === 'accuracy') {
        mode = 'practice';
        document.getElementById('mode-btn').textContent = 'وضع التعلم الحر 🌟';
        document.getElementById('time-val').textContent = '∞';
      } else {
        mode = 'challenge';
        document.getElementById('mode-btn').textContent = 'تحدي السرعة (٩٠ث) ⏱️';
        document.getElementById('time-val').textContent = timeLeft + 'ث';
      }
    }

    function speakCurrentSentence() {
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(SENTENCES[currentIdx].tashkeelFull);
        u.lang = 'ar-SA';
        window.speechSynthesis.speak(u);
      }
    }

    initSentence();
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'qurtuba-reading-challenge.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
