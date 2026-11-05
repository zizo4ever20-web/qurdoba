import confetti from 'canvas-confetti';

/**
 * Fires a joyful celebratory confetti burst when a sentence is arranged correctly.
 * Colors match the joyful theme: turquoise, olive, orange, gold, and ruby red.
 */
export function triggerSentenceConfetti() {
  try {
    // 1. Center burst with stars and circles
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#0891b2', '#0284c7', '#ea580c', '#eab308', '#dc2626', '#16a34a'],
      ticks: 200,
      gravity: 1.1,
      scalar: 1.15,
      shapes: ['circle', 'square'],
      disableForReducedMotion: true,
    });

    // 2. Subtle extra sparkles
    setTimeout(() => {
      confetti({
        particleCount: 20,
        angle: 60,
        spread: 55,
        origin: { x: 0.2, y: 0.7 },
        colors: ['#facc15', '#38bdf8', '#4ade80'],
        scalar: 0.9,
      });
      confetti({
        particleCount: 20,
        angle: 120,
        spread: 55,
        origin: { x: 0.8, y: 0.7 },
        colors: ['#fb923c', '#f43f5e', '#a855f7'],
        scalar: 0.9,
      });
    }, 120);
  } catch {
    // Graceful fallback if canvas is unsupported
  }
}

/**
 * Massive celebration fireworks cannon when finishing a challenge or full round
 */
export function triggerGrandVictoryConfetti() {
  try {
    const end = Date.now() + 1200;
    const colors = ['#0891b2', '#0284c7', '#ea580c', '#eab308', '#dc2626', '#16a34a'];

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: colors,
      });
    }, 200);
  } catch {
    // Ignore
  }
}
