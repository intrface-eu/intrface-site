"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { useTranslations } from "next-intl";
import type { FragmentProps } from "@/lib/site/interfaces";
import {
  DEFAULT_TEMPO,
  MAX_STEPS,
  PITCHES,
  STEPS,
  TEMPOS,
  defaultPattern,
} from "./midiflow-data";
import { useWorkPieceActive } from "./work-piece-context";
import styles from "./midiflow-fragment.module.css";

const ROWS = PITCHES.length;
/** Seconds of audio scheduled ahead of the clock, and how often we top it up. */
const LOOKAHEAD = 0.1;
const TICK_MS = 25;

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const readReduce = () => window.matchMedia(REDUCE).matches;
const readReduceServer = () => false;

/** Expanded on a screen this wide, the grid shows and plays two bars. */
const WIDE = "(min-width: 64rem)";
const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const readWide = () => window.matchMedia(WIDE).matches;

/** One note: a triangle oscillator through one gain node shaped as a short pluck. */
function pluck(ctx: AudioContext, hz: number, at: number) {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = hz;
  env.gain.setValueAtTime(0.0001, at);
  env.gain.exponentialRampToValueAtTime(0.16, at + 0.01);
  env.gain.exponentialRampToValueAtTime(0.0001, at + 0.3);
  osc.connect(env).connect(ctx.destination);
  osc.onended = () => env.disconnect();
  osc.start(at);
  osc.stop(at + 0.32);
}

/**
 * Lookahead scheduler on the audio clock. A short timer tops up the next
 * LOOKAHEAD seconds of notes; a rAF loop moves the playhead when the audio
 * clock reaches each queued step. No React state per step.
 */
class Sequencer {
  ctx: AudioContext | null = null;
  pattern = defaultPattern();
  tempo: number = DEFAULT_TEMPO;
  /** Steps in the loop: one bar, or two. */
  steps: number = STEPS;
  running = false;
  buttons: (HTMLButtonElement | null)[] = [];
  head: HTMLElement | null = null;
  private timer = 0;
  private raf = 0;
  private next = 0;
  private step = 0;
  private shown = -1;
  private queue: { s: number; t: number }[] = [];

  /** Only ever called from a user gesture: creates or wakes the context. */
  audio() {
    this.ctx ??= new AudioContext();
    if (this.ctx.state !== "running") void this.ctx.resume();
    return this.ctx;
  }

  note(row: number) {
    const ctx = this.audio();
    pluck(ctx, PITCHES[row].hz, ctx.currentTime + 0.005);
  }

  start() {
    const ctx = this.audio();
    this.halt();
    this.running = true;
    this.step = 0;
    this.next = ctx.currentTime + 0.06;
    this.tick();
    this.frame();
  }

  halt() {
    this.running = false;
    window.clearTimeout(this.timer);
    cancelAnimationFrame(this.raf);
    this.queue.length = 0;
    this.show(-1);
  }

  sleep() {
    this.halt();
    if (this.ctx?.state === "running") void this.ctx.suspend();
  }

  close() {
    this.halt();
    void this.ctx?.close();
    this.ctx = null;
  }

  private tick = () => {
    const ctx = this.ctx;
    if (!ctx || !this.running) return;
    while (this.next < ctx.currentTime + LOOKAHEAD) {
      for (let p = 0; p < ROWS; p++) {
        if (this.pattern[p * MAX_STEPS + this.step]) pluck(ctx, PITCHES[p].hz, this.next);
      }
      this.queue.push({ s: this.step, t: this.next });
      this.next += 15 / this.tempo; // a sixteenth note
      this.step = (this.step + 1) % this.steps;
    }
    this.timer = window.setTimeout(this.tick, TICK_MS);
  };

  private frame = () => {
    const ctx = this.ctx;
    if (!ctx || !this.running) return;
    let s = -1;
    while (this.queue.length && this.queue[0].t <= ctx.currentTime) {
      s = this.queue.shift()!.s;
    }
    if (s >= 0 && s !== this.shown) this.show(s);
    this.raf = requestAnimationFrame(this.frame);
  };

  private show(s: number) {
    const b = this.buttons;
    if (this.shown >= 0) {
      for (let p = 0; p < ROWS; p++) b[p * MAX_STEPS + this.shown]?.removeAttribute("data-hit");
    }
    this.shown = s;
    if (s < 0) return;
    this.head?.style.setProperty("--step", String(s));
    for (let p = 0; p < ROWS; p++) b[p * MAX_STEPS + s]?.setAttribute("data-hit", "");
  }
}

export function MidiflowFragment({ expanded }: FragmentProps) {
  const t = useTranslations("HomeGrid.midiflow");
  const reduced = useSyncExternalStore(subscribeReduce, readReduce, readReduceServer);
  const wide = useSyncExternalStore(subscribeWide, readWide, readReduceServer);
  const active = useWorkPieceActive();
  const steps = expanded && wide ? MAX_STEPS : STEPS;
  const [pattern, setPattern] = useState(defaultPattern);
  const [playing, setPlaying] = useState(false);
  const [tempo, setTempo] = useState<number>(DEFAULT_TEMPO);
  const [focusRaw, setFocusIdx] = useState((ROWS - 1) * MAX_STEPS);
  // A focus left on the second bar falls back into the first when it closes.
  const focusIdx = focusRaw % MAX_STEPS < steps ? focusRaw : focusRaw - STEPS;
  const rootRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<Sequencer | null>(null);
  const hintId = useId();

  const seq = () => (seqRef.current ??= new Sequencer());

  useEffect(() => {
    const s = seqRef.current;
    if (!s) return;
    s.steps = steps;
    // The loop restarts on the new length rather than play past its end.
    if (s.running) s.start();
  }, [steps]);

  // Leaving the work cell: silent at once, before the fade ends.
  useEffect(() => {
    if (active) return;
    seqRef.current?.sleep();
    setPlaying(false);
  }, [active]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const sleep = () => {
      seqRef.current?.sleep();
      setPlaying(false);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) sleep();
    });
    io.observe(root);
    const onVisibility = () => {
      if (document.hidden) sleep();
    };
    document.addEventListener("visibilitychange", onVisibility);
    // Under reduced motion the loop ends; notes already scheduled (the
    // current step) still sound.
    const mq = window.matchMedia(REDUCE);
    const onReduce = () => {
      if (!mq.matches) return;
      seqRef.current?.halt();
      setPlaying(false);
    };
    mq.addEventListener("change", onReduce);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      mq.removeEventListener("change", onReduce);
      seqRef.current?.close();
    };
  }, []);

  const commit = (next: boolean[]) => {
    seq().pattern = next;
    setPattern(next);
  };

  const toggle = (i: number) => {
    const s = seq();
    const next = s.pattern.slice();
    next[i] = !next[i];
    commit(next);
    setFocusIdx(i);
    if (next[i] && !s.running) s.note(Math.floor(i / MAX_STEPS));
  };

  const onPlay = () => {
    const s = seq();
    if (s.running) {
      s.halt();
      setPlaying(false);
    } else if (!reduced) {
      s.steps = steps;
      s.start();
      setPlaying(true);
    }
  };

  const onTempo = (bpm: number) => {
    seq().tempo = bpm;
    setTempo(bpm);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let p = Math.floor(focusIdx / MAX_STEPS);
    let s = focusIdx % MAX_STEPS;
    switch (e.key) {
      case "ArrowRight": s = Math.min(steps - 1, s + 1); break;
      case "ArrowLeft": s = Math.max(0, s - 1); break;
      case "ArrowUp": p = Math.max(0, p - 1); break;
      case "ArrowDown": p = Math.min(ROWS - 1, p + 1); break;
      case "Home": s = 0; break;
      case "End": s = steps - 1; break;
      default: return;
    }
    e.preventDefault();
    const i = p * MAX_STEPS + s;
    setFocusIdx(i);
    seq().buttons[i]?.focus();
  };

  return (
    <div ref={rootRef} className={`${styles.root} h-full w-full`} data-fragment="midiflow"
      data-expanded={expanded || undefined}
    >
      <div className={styles.controls}>
        <button
          type="button"
          className={`${styles.play} type-meta`}
          onClick={onPlay}
          disabled={reduced && !playing}
          aria-describedby={hintId}
        >
          {playing ? t("stop") : t("play")}
        </button>
        <button type="button" className={`${styles.control} type-meta`} onClick={() => commit(new Array<boolean>(ROWS * MAX_STEPS).fill(false))}>
          {t("clear")}
        </button>
        <div role="group" aria-label={t("tempo")} className={styles.tempo}>
          <span className={`${styles.tempoLabel} type-meta`} aria-hidden="true">
            {t("tempo")}
          </span>
          {TEMPOS.map((bpm) => (
            <button
              key={bpm}
              type="button"
              className={`${styles.control} type-meta type-data`}
              aria-pressed={tempo === bpm}
              onClick={() => onTempo(bpm)}
            >
              {bpm}
            </button>
          ))}
        </div>
      </div>
      <p id={hintId} className={`${styles.hint} type-caption`}>
        {t("hint")}
      </p>
      <div
        role="group"
        aria-label={t("gridLabel")}
        aria-describedby={hintId}
        className={styles.grid}
        data-playing={playing || undefined}
        data-bars={steps === MAX_STEPS ? 2 : undefined}
        onKeyDown={onKeyDown}
      >
        <span
          ref={(el) => {
            seq().head = el;
          }}
          className={styles.playhead}
          aria-hidden="true"
        />
        {[0, 1].map((band) =>
          PITCHES.map((pitch, p) => (
            <span
              key={`${band}-${pitch.name}`}
              className={`${styles.pitch} type-meta type-data`}
              data-band={band}
              data-top={p === 0 || undefined}
              style={{ "--r8": band * 6 + p + 1, "--r16": p + 1 } as CSSProperties}
              aria-hidden="true"
            >
              {pitch.name}
            </span>
          )),
        )}
        {pattern.map((on, i) => {
          const p = Math.floor(i / MAX_STEPS);
          const s = i % MAX_STEPS;
          if (s >= steps) return null;
          const place = {
            "--c16": s + 2,
            "--r16": p + 1,
            "--c8": (s % 8) + 2,
            "--r8": (s < 8 ? 0 : 6) + p + 1,
          } as CSSProperties;
          return (
            <button
              key={i}
              ref={(el) => {
                seq().buttons[i] = el;
              }}
              type="button"
              className={styles.step}
              style={place}
              data-beat={s % 4 === 0 || undefined}
              data-top={p === 0 || undefined}
              aria-pressed={on}
              aria-label={t("step", { step: s + 1, note: PITCHES[p].name })}
              tabIndex={i === focusIdx ? 0 : -1}
              onClick={() => toggle(i)}
              onFocus={() => setFocusIdx(i)}
            >
              <span className={styles.mark} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
