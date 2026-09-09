document.addEventListener('DOMContentLoaded', () => {
  let soundEnabled = false;
  let audioCtx = null;

  // Web Audio synthesizer for crisp pop clicks without asset dependencies
  const playPop = (freq = 440) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      // Handles browsers with strict audio autoplay guards
    }
  };

  const qs = document.querySelector.bind(document);
  const easingHeart = mojs.easing.path(
    "M0,100C2.9,86.7,33.6-7.3,46-7.3s15.2,22.7,26,22.7S89,0,100,0"
  );

  const el = {
    container: qs(".mo-container"),
    i: qs(".lttr--I"),
    l: qs(".lttr--L"),
    o: qs(".lttr--O"),
    v: qs(".lttr--V"),
    e: qs(".lttr--E"),
    y: qs(".lttr--Y"),
    o2: qs(".lttr--O2"),
    u: qs(".lttr--U"),
    lineLeft: qs(".line--left"),
    lineRight: qs(".line--rght"),
    colTxt: "#763c8c",
    colHeart: "#fa4843",
    sound: qs(".sound")
  };

  class Heart extends mojs.CustomShape {
    getShape() {
      return '<path d="M50,88.9C25.5,78.2,0.5,54.4,3.8,31.1S41.3,1.8,50,29.9c8.7-28.2,42.8-22.2,46.2,1.2S74.5,78.2,50,88.9z"/>';
    }
    getLength() {
      return 200;
    }
  }
  mojs.addShape("heart", Heart);

  const crtBoom = (delay = 0, x = 0, rd = 46) => {
    const parent = el.container;
    const crcl = new mojs.Shape({
      shape: "circle",
      fill: "none",
      stroke: el.colTxt,
      strokeWidth: { 5: 0 },
      radius: { [rd]: rd + 20 },
      easing: "quint.out",
      duration: 500 / 3,
      parent,
      delay,
      x
    });

    const brst = new mojs.Burst({
      radius: { [rd + 15]: 110 },
      angle: "rand(60, 180)",
      count: 3,
      timeline: { delay },
      parent,
      x,
      children: {
        radius: [5, 3, 7],
        fill: el.colTxt,
        scale: { 1: 0, easing: "quad.in" },
        pathScale: [0.8, null],
        degreeShift: ["rand(13, 60)", null],
        duration: 1000 / 3,
        easing: "quint.out"
      }
    });

    return [crcl, brst];
  };

  const crtLoveTl = () => {
    const move = 1000;
    const boom = 200;
    const easing = "sin.inOut";
    const easingBoom = "sin.in";
    const easingOut = "sin.out";
    const opts = { duration: move, easing, opacity: 1 };
    const delta = 150;

    const letters = [el.i, el.l, el.o, el.v, el.e, el.y, el.o2, el.u];

    const resetLetters = () => {
      letters.forEach((item) => {
        item.style.opacity = 1;
        item.style.transform = "none";
      });
    };

    return new mojs.Timeline().add([
      new mojs.Tween({
        duration: move,
        onStart: resetLetters,
        onComplete: () => {
          [el.l, el.o, el.v, el.e].forEach((l) => (l.style.opacity = 0));
          playPop(300);
        }
      }),

      new mojs.Tween({
        duration: move * 2 + boom,
        onComplete: () => {
          [el.y, el.o2].forEach((l) => (l.style.opacity = 0));
          playPop(340);
        }
      }),

      new mojs.Tween({
        duration: move * 3 + boom * 2 - delta,
        onComplete: () => {
          el.i.style.opacity = 0;
          playPop(380);
        }
      }),

      new mojs.Tween({
        duration: move * 3 + boom * 2,
        onComplete: () => {
          el.u.style.opacity = 0;
          playPop(440);
        }
      }),

      new mojs.Tween({
        duration: 50,
        delay: 4050,
        onComplete: resetLetters
      }),

      new mojs.Html({
        ...opts,
        el: el.lineLeft,
        x: { 0: 52 }
      })
        .then({ duration: boom + move, easing, x: { to: 106 } })
        .then({ duration: boom + move, easing, x: { to: 166 } })
        .then({ duration: 150, easing, x: { to: 176 } })
        .then({ duration: 300 })
        .then({ duration: 350, x: { to: 0 }, easing: easingOut }),

      new mojs.Html({
        ...opts,
        el: el.lineRight,
        x: { 0: -52 }
      })
        .then({ duration: boom + move, easing, x: { to: -106 } })
        .then({ duration: boom + move, easing, x: { to: -166 } })
        .then({ duration: 150, easing, x: { to: -176 } })
        .then({ duration: 300 })
        .then({ duration: 350, x: { to: 0 }, easing: easingOut }),

      new mojs.Html({ ...opts, el: el.i, x: { 0: 34 } })
        .then({ duration: boom, easing: easingBoom, x: { to: 53 } })
        .then({ duration: move, easing, x: { to: 93 } })
        .then({ duration: boom, easing: easingBoom, x: { to: 123 } })
        .then({ duration: move, easing, x: { to: 153 } }),

      new mojs.Html({ ...opts, el: el.l, x: { 0: 15 } }),
      new mojs.Html({ ...opts, el: el.o, x: { 0: 11 } }),
      new mojs.Html({ ...opts, el: el.v, x: { 0: 3 } }),
      new mojs.Html({ ...opts, el: el.e, x: { 0: -3 } }),

      new mojs.Html({ ...opts, el: el.y, x: { 0: -20 } })
        .then({ duration: boom, easing: easingBoom, x: { to: -53 } })
        .then({ duration: move, easing, x: { to: -77 } }),

      new mojs.Html({ ...opts, el: el.o2, x: { 0: -27 } })
        .then({ duration: boom, easing: easingBoom, x: { to: -54 } })
        .then({ duration: move, easing, x: { to: -84 } }),

      new mojs.Html({ ...opts, el: el.u, x: { 0: -32 } })
        .then({ duration: boom, easing: easingBoom, x: { to: -53 } })
        .then({ duration: move, easing, x: { to: -89 } })
        .then({ duration: boom, easing: easingBoom, x: { to: -120 } })
        .then({ duration: move, easing, x: { to: -147 } }),

      new mojs.Shape({
        parent: el.container,
        shape: "heart",
        delay: move,
        fill: el.colHeart,
        x: -64,
        scale: { 0: 0.95, easing: easingHeart },
        duration: 500
      })
        .then({ duration: boom + move - 500, x: { to: -62, easing }, scale: { to: 0.65, easing } })
        .then({ duration: boom - 50, x: { to: -14 }, scale: { to: 0.9 }, easing: easingBoom })
        .then({ duration: 125, scale: { to: 0.8 }, easing: easingOut })
        .then({ duration: 125, scale: { to: 0.85 }, easing: easingOut })
        .then({ duration: move - 200, scale: { to: 0.45 }, easing })
        .then({ delay: -75, duration: 150, x: { to: 0 }, scale: { to: 0.9 }, easing: easingBoom })
        .then({ duration: 125, scale: { to: 0.8 }, easing: easingOut })
        .then({ duration: 125, scale: { to: 0.85 }, easing: easingOut })
        .then({ duration: 125 })
        .then({ duration: 350, scale: { to: 0 }, easing: easingOut }),

      ...crtBoom(move, -64, 46),
      ...crtBoom(move * 2 + boom, 18, 34),
      ...crtBoom(move * 3 + boom * 2 - delta, -64, 34),
      ...crtBoom(move * 3 + boom * 2, 45, 34)
    ]);
  };

  const loveTl = crtLoveTl().play();
  setInterval(() => {
    loveTl.replay();
  }, 4300);

  el.sound.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      el.sound.classList.remove("sound--off");
      el.sound.textContent = "sound (on)";
      playPop(520);
    } else {
      el.sound.classList.add("sound--off");
      el.sound.textContent = "sound (off)";
    }
  });
});