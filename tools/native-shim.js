// Android's built-in browser has no speech feature, so reading aloud goes through the phone's own text-to-speech.
(function () {
  const B = window.AndroidBridge; if (!B) return;
  let list = [], next = 1, live = new Map();
  const load = () => { try { list = JSON.parse(B.voices()); } catch (e) { list = []; } };
  const listeners = [];
  window.SpeechSynthesisUtterance = function (t) { this.text = t; this.lang = 'en-US'; this.pitch = 1; this.rate = 1; this.voice = null; };
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
    getVoices() { if (!list.length) load(); return list; },
    addEventListener(n, f) { if (n === 'voiceschanged') listeners.push(f); },
    speak(u) { const id = next++; live.set(id, u); B.speak(String(id), u.text, u.lang, u.voice ? u.voice.voiceURI : '', u.pitch, u.rate); },
    cancel() { live.clear(); B.stop(); },
  } });
  window.__tts = (kind, id, a, b) => {
    if (kind === 'ready') { load(); listeners.forEach(f => f()); return; }
    const u = live.get(id); if (!u) return;
    if (kind === 'range' && u.onboundary) u.onboundary({ name: 'word', charIndex: a, charLength: b });
    if (kind === 'end') { live.delete(id); if (u.onend) u.onend(); }
  };
})();
