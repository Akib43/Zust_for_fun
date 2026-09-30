import {
  Component, inject, PLATFORM_ID, signal,
  AfterViewInit, OnDestroy, ElementRef, ViewChild, computed
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Chapter {
  num: number; roman: string; era: string;
  title: string; subtitle: string; story: string;
  youtubeId: string; milestone: string;
}

const CHAPTERS: Chapter[] = [
  { num:1, roman:'I',   era:'The Loss',          title:'Let Her Leave',                         subtitle:'The hardest lesson nobody teaches you',       story:`There comes a moment in every man's life when someone he cared about deeply walks out the door. Zarif Shamit Zamal knows that moment. It is not the leaving that breaks you — it is the staying broken that does. The first step of his journey began here: understanding that letting go is not weakness. It is the beginning of everything.`,    youtubeId:'-kBnCqwSO98',  milestone:'Learning to let go' },
  { num:2, roman:'II',  era:'The Pain',           title:'Dealing With Heartbreak',               subtitle:'When the world feels like it is ending',       story:`Heartbreak does not announce itself politely. It hits at 3am. It hits when a song plays. It hits in the silence. Zarif Shamit Zamal sat with that pain — did not run from it, did not numb it. He faced it. Because you cannot build a new version of yourself on top of wounds you never dealt with. This chapter is about going through it, not around it.`,     youtubeId:'pgmG96DZ5NE',  milestone:'Facing the pain' },
  { num:3, roman:'III', era:'The Turning Point',  title:"She Broke You? Here's What You Do Now", subtitle:'The moment anger turns into direction',        story:`There is a specific kind of strength that is born only from being broken. Zarif Shamit Zamal found it. When the dust settled and the tears dried, something else emerged — a quiet, burning clarity. She did not destroy him. She revealed him. What you do in the days after the fall defines the entire next chapter of your life.`,               youtubeId:'1KDhwwXf0zA',  milestone:'Found his direction' },
  { num:4, roman:'IV',  era:'The War Within',     title:'Control Your Mind or Be Controlled',    subtitle:'The battle no one else can fight for you',     story:`The hardest opponent Zarif Shamit Zamal ever faced was not another person. It was his own mind — the doubts, the replays, the what-ifs. This is the chapter where he learned that mental discipline is not optional. You either train your mind to serve you, or your mind trains you to serve your pain. Zarif Shamit Zamal chose the former.`,           youtubeId:'MtpO1Mb_D-Y',  milestone:'Mastered his mindset' },
  { num:5, roman:'V',   era:'The Grind',          title:'Do It Alone, Broke, Tired & Scared',    subtitle:'Nobody is coming to save you',                 story:`No one showed up. No one handed him a map. Zarif Shamit Zamal had to build in the dark — exhausted, uncertain, sometimes scared. But he kept going. Because the version of yourself you are trying to become does not care how you feel today. It only cares whether you showed up. He showed up. Every single day.`,                                      youtubeId:'UTr8QibueQY',  milestone:'Never stopped moving' },
  { num:6, roman:'VI',  era:'The Return',         title:'The Comeback',                          subtitle:'They counted him out. He counted up.',          story:`This is the chapter people do not expect. The one where Zarif Shamit Zamal came back — not as the person he was before, but as something sharper, harder, and more certain of who he is. The comeback is not loud. It does not announce itself. You just wake up one day and realize the storm is behind you, and everything you built in the dark is standing in the light.`, youtubeId:'nBJDDf7OX-4',  milestone:'The comeback complete' },
];

const EMBER_DATA = [
  {left:'8%', delay:'0s',   dur:'3.2s', dx:'-15px'}, {left:'15%',delay:'0.4s', dur:'2.8s', dx:'20px'},
  {left:'22%',delay:'1.1s', dur:'4.0s', dx:'-10px'}, {left:'30%',delay:'0.2s', dur:'3.5s', dx:'25px'},
  {left:'38%',delay:'0.9s', dur:'2.5s', dx:'-20px'}, {left:'45%',delay:'0.6s', dur:'3.8s', dx:'12px'},
  {left:'52%',delay:'1.4s', dur:'2.9s', dx:'-25px'}, {left:'60%',delay:'0.1s', dur:'4.2s', dx:'18px'},
  {left:'68%',delay:'0.7s', dur:'3.1s', dx:'-12px'}, {left:'75%',delay:'1.2s', dur:'2.7s', dx:'22px'},
  {left:'82%',delay:'0.3s', dur:'3.6s', dx:'-18px'}, {left:'90%',delay:'0.8s', dur:'4.5s', dx:'10px'},
  {left:'25%',delay:'1.6s', dur:'3.3s', dx:'-22px'}, {left:'55%',delay:'0.5s', dur:'2.6s', dx:'15px'},
  {left:'70%',delay:'1.9s', dur:'3.9s', dx:'-8px'},  {left:'42%',delay:'2.1s', dur:'3.0s', dx:'28px'},
  {left:'18%',delay:'1.8s', dur:'4.1s', dx:'-16px'}, {left:'78%',delay:'2.4s', dur:'2.4s', dx:'20px'},
  {left:'35%',delay:'2.7s', dur:'3.7s', dx:'-24px'}, {left:'62%',delay:'1.3s', dur:'2.2s', dx:'14px'},
];

const SMOKE_DATA = [
  {left:'20%', delay:'0s',   dur:'5s'},
  {left:'40%', delay:'1.5s', dur:'6s'},
  {left:'60%', delay:'0.8s', dur:'4.5s'},
  {left:'80%', delay:'2.2s', dur:'5.5s'},
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: `
    <div class="bugatti-photo-bg" aria-hidden="true"></div>

    <div class="page">

      <!-- Hero -->
      <header class="hero">
        <div class="hero__glow" aria-hidden="true"></div>
        <p class="hero__eyebrow">A Life in Chapters</p>
        <h1 class="hero__title">Zarif Shamit Zamal</h1>
        <p class="hero__sub">Six chapters. One journey. From heartbreak to comeback — the story of a man who refused to stay down.</p>
        <div class="hero__scroll" aria-hidden="true">
          <span class="hero__scroll-label">Scroll to begin</span>
          <div class="hero__scroll-line"></div>
        </div>
      </header>

      <!-- Chapters -->
      <main>
        @for (ch of chapters; track ch.num) {
          <div class="divider">
            <div class="divider__line"></div>
            <span class="divider__label">Chapter {{ ch.roman }} &mdash; {{ ch.era }}</span>
            <div class="divider__line"></div>
          </div>
          <article class="chapter" [attr.aria-label]="'Chapter ' + ch.roman + ': ' + ch.title">
            <div class="chapter__header">
              <div class="chapter__watermark" aria-hidden="true">{{ ch.roman }}</div>
              <div class="chapter__header-inner">
                <p class="chapter__eyebrow">{{ ch.subtitle }}</p>
                <h2 class="chapter__title">{{ ch.title }}</h2>
                <span class="chapter__badge">★ {{ ch.milestone }}</span>
              </div>
            </div>
            <div class="chapter__body">
              <div class="chapter__story">
                <div class="chapter__quote-mark" aria-hidden="true">&ldquo;</div>
                <p class="chapter__text">{{ ch.story }}</p>
              </div>
              <div class="chapter__video-wrap">
                <div class="video-frame">
                  <div class="video-ratio">
                    @if (isBrowser) {
                      <iframe [src]="safeUrl(ch.youtubeId)" [title]="ch.title" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen loading="lazy"></iframe>
                    }
                  </div>
                </div>
                @if (ch.num < chapters.length) {
                  <p class="chapter__next-hint">↓ &nbsp; Chapter {{ chapters[ch.num].roman }} follows</p>
                }
              </div>
            </div>
          </article>
        }
      </main>

      <!-- ══ BURNING RITUAL ══ -->
      <section class="ritual-section" aria-label="Burning Ritual">
        <p class="ritual-section__eyebrow">🔥 The Burning Ritual</p>
        <h2 class="ritual-section__title">Speak Your Words Into the Fire</h2>
        <p class="ritual-section__sub">Type anything. Watch it burn. Hear it spoken by the voice of the ritual.</p>
        <div class="ritual-form">
          <input
            class="ritual-input"
            type="text"
            placeholder="Type your words to burn..."
            [value]="ritualText()"
            (input)="ritualText.set(getVal($event))"
            (keydown.enter)="startRitual()"
            maxlength="180"
            aria-label="Enter text to burn in the ritual"
          />
          <button
            class="ritual-btn"
            (click)="startRitual()"
            [disabled]="!ritualText().trim() || burning()"
          >🔥 IGNITE</button>
        </div>
      </section>

      <!-- Epilogue -->
      <footer class="epilogue">
        <p class="epilogue__eyebrow">Epilogue</p>
        <h2 class="epilogue__title">The story is not over.</h2>
        <p class="epilogue__body">Every chapter Zarif Shamit Zamal lived through added another layer to who he is. The comeback was not the end — it was just the beginning of the real journey.</p>
        <p class="epilogue__credit">ZARIF SHAMIT ZAMAL — LIFE COMPILATION</p>
      </footer>
    </div>

    <!-- ══ RITUAL OVERLAY ══ -->
    @if (burning()) {
      <div class="ritual-overlay"
           [class.igniting]="ritualPhase() === 'igniting'"
           [class.fading]="ritualPhase() === 'fading'"
           role="dialog" aria-modal="true" aria-label="Burning ritual">

        <!-- Embers -->
        @for (e of embers; track $index) {
          <div class="ember"
               [style]="'left:'+e.left+';animation-delay:'+e.delay+';animation-duration:'+e.dur+';--dx:'+e.dx+';bottom:35vh;'">
          </div>
        }
        <!-- Smoke -->
        @for (s of smokes; track $index) {
          <div class="smoke"
               [style]="'left:'+s.left+';animation-delay:'+s.delay+';animation-duration:'+s.dur+';'">
          </div>
        }

        <!-- Ground glow only — no fake flames -->
        <div class="fire-glow" aria-hidden="true"></div>

        <!-- ══ RITUAL CIRCLE ══ -->
        <div class="ritual-circle-wrap"
             [class.visible]="ritualPhase() === 'igniting'"
             [class.burning]="ritualPhase() === 'burning' || ritualPhase() === 'fading'"
             aria-hidden="true">
          <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;overflow:visible;">
            <!-- Dark fill inside circle -->
            <circle cx="150" cy="150" r="138" fill="oklch(6% 0.05 30 / 0.6)"/>
            <!-- Outer ring (draws in) -->
            <circle cx="150" cy="150" r="140" fill="none" stroke="#ff4400" stroke-width="3" class="rc-ring-outer"/>
            <!-- 4 alternating filled arc segments between rings r95→r140 -->
            <path class="rc-seg" d="M279.3,203.6 A140,140 0 0,1 203.6,279.3 L186.3,237.7 A95,95 0 0,0 237.7,186.3 Z" fill="#ff4400" opacity="0.4"/>
            <path class="rc-seg" d="M96.4,279.3  A140,140 0 0,1 20.7,203.6  L62.3,186.3  A95,95  0 0,0 113.7,237.7 Z" fill="#ff4400" opacity="0.4"/>
            <path class="rc-seg" d="M20.7,96.4   A140,140 0 0,1 96.4,20.7   L113.7,62.3  A95,95  0 0,0 62.3,113.7  Z" fill="#ff4400" opacity="0.4"/>
            <path class="rc-seg" d="M203.6,20.7  A140,140 0 0,1 279.3,96.4  L237.7,113.7 A95,95  0 0,0 186.3,62.3  Z" fill="#ff4400" opacity="0.4"/>
            <!-- 8 radial dividing lines r95→r140 -->
            <line x1="245" y1="150" x2="290" y2="150" stroke="#ff6600" stroke-width="1" opacity="0.6"/>
            <line x1="150" y1="55"  x2="150" y2="10"  stroke="#ff6600" stroke-width="1" opacity="0.6"/>
            <line x1="55"  y1="150" x2="10"  y2="150" stroke="#ff6600" stroke-width="1" opacity="0.6"/>
            <line x1="150" y1="245" x2="150" y2="290" stroke="#ff6600" stroke-width="1" opacity="0.6"/>
            <line x1="217.2" y1="82.8"  x2="246.5" y2="53.5"  stroke="#ff6600" stroke-width="1" opacity="0.6"/>
            <line x1="82.8"  y1="82.8"  x2="53.5"  y2="53.5"  stroke="#ff6600" stroke-width="1" opacity="0.6"/>
            <line x1="82.8"  y1="217.2" x2="53.5"  y2="246.5" stroke="#ff6600" stroke-width="1" opacity="0.6"/>
            <line x1="217.2" y1="217.2" x2="246.5" y2="246.5" stroke="#ff6600" stroke-width="1" opacity="0.6"/>
            <!-- Inner ring (draws in) -->
            <circle cx="150" cy="150" r="95" fill="none" stroke="#ff6600" stroke-width="1.5" class="rc-ring-inner"/>
            <!-- 8-pointed star inside inner ring -->
            <polygon class="rc-star"
              points="238,150 186.9,165.3 212.2,212.2 165.3,186.9 150,238 134.7,186.9 87.8,212.2 113.1,165.3 62,150 113.1,134.7 87.8,87.8 134.7,113.1 150,62 165.3,113.1 212.2,87.8 186.9,134.7"
              fill="none" stroke="#ff8800" stroke-width="1.5"/>
            <!-- Rune symbols at 8 positions (between rings) -->
            <text class="rc-rune" x="265" y="154" font-size="13" fill="#ff8800" text-anchor="middle" dominant-baseline="middle" font-family="serif">ᚠ</text>
            <text class="rc-rune" x="233" y="233" font-size="13" fill="#ff8800" text-anchor="middle" dominant-baseline="middle" font-family="serif">ᚢ</text>
            <text class="rc-rune" x="150" y="265" font-size="13" fill="#ff8800" text-anchor="middle" dominant-baseline="middle" font-family="serif">ᚦ</text>
            <text class="rc-rune" x="67"  y="233" font-size="13" fill="#ff8800" text-anchor="middle" dominant-baseline="middle" font-family="serif">ᚨ</text>
            <text class="rc-rune" x="35"  y="154" font-size="13" fill="#ff8800" text-anchor="middle" dominant-baseline="middle" font-family="serif">ᚱ</text>
            <text class="rc-rune" x="67"  y="67"  font-size="13" fill="#ff8800" text-anchor="middle" dominant-baseline="middle" font-family="serif">ᚲ</text>
            <text class="rc-rune" x="150" y="35"  font-size="13" fill="#ff8800" text-anchor="middle" dominant-baseline="middle" font-family="serif">ᚷ</text>
            <text class="rc-rune" x="233" y="67"  font-size="13" fill="#ff8800" text-anchor="middle" dominant-baseline="middle" font-family="serif">ᚹ</text>
            <!-- Center pulsing dot -->
            <circle cx="150" cy="150" r="6" fill="#ffcc00" class="rc-center"/>
          </svg>
        </div>

        <!-- ══ BURNING DOLL ══ -->
        <div class="doll-wrap" [class.burning]="ritualPhase() === 'burning' || ritualPhase() === 'fading'" aria-hidden="true">
          <!-- Flying sparks off the doll -->
          <div class="doll-spark" style="left:20%;top:60%;animation-duration:1.1s;animation-delay:0.3s;--sa:-20deg;"></div>
          <div class="doll-spark" style="left:75%;top:50%;animation-duration:0.9s;animation-delay:0.7s;--sa:25deg;"></div>
          <div class="doll-spark" style="left:45%;top:30%;animation-duration:1.3s;animation-delay:0.1s;--sa:-10deg;"></div>
          <div class="doll-spark" style="left:10%;top:70%;animation-duration:0.8s;animation-delay:1.0s;--sa:35deg;"></div>
          <div class="doll-spark" style="left:85%;top:65%;animation-duration:1.2s;animation-delay:0.5s;--sa:-30deg;"></div>
          <!-- Clip wrapper — fire eats from bottom upward -->
          <div class="doll-clip-wrap">
            <svg class="doll-svg" viewBox="0 0 100 220" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <!-- Ellipse clip for face photo -->
                <clipPath id="faceClip">
                  <ellipse cx="50" cy="27" rx="21" ry="24"/>
                </clipPath>
                <!-- Vignette gradient on face -->
                <radialGradient id="faceVignette" cx="50%" cy="50%" r="50%">
                  <stop offset="60%" stop-color="transparent"/>
                  <stop offset="100%" stop-color="rgba(0,0,0,0.55)"/>
                </radialGradient>
              </defs>

              <!-- ── FACE PHOTO (clipped to head ellipse) ── -->
              <!-- Photo is portrait; face is at ~top 30%. Image y=-8 places face centre at SVG y=27 -->
              <image [attr.href]="dollFaceUrl"
                     x="9" y="-8" width="82" height="146"
                     clip-path="url(#faceClip)"
                     preserveAspectRatio="xMidYMin slice"/>
              <!-- Vignette over face photo -->
              <ellipse cx="50" cy="27" rx="21" ry="24" fill="url(#faceVignette)"/>
              <!-- Face outline / border -->
              <ellipse cx="50" cy="27" rx="21" ry="24" fill="none" stroke="#5c3a1a" stroke-width="1.5"/>

              <!-- ── HAIR on top of photo ── -->
              <path d="M29 12 Q30 2 35 0 Q40 -3 50 -2 Q60 -3 65 0 Q70 2 71 12"
                    fill="#1a0a00" stroke="none"/>
              <line x1="34" y1="5"  x2="30" y2="-3" stroke="#1a0a00" stroke-width="2.5" stroke-linecap="round"/>
              <line x1="43" y1="2"  x2="41" y2="-5" stroke="#1a0a00" stroke-width="2" stroke-linecap="round"/>
              <line x1="50" y1="1"  x2="50" y2="-5" stroke="#1a0a00" stroke-width="2" stroke-linecap="round"/>
              <line x1="57" y1="2"  x2="59" y2="-5" stroke="#1a0a00" stroke-width="2" stroke-linecap="round"/>
              <line x1="66" y1="5"  x2="70" y2="-3" stroke="#1a0a00" stroke-width="2.5" stroke-linecap="round"/>

              <!-- ── NECK ── -->
              <rect x="44" y="49" width="12" height="10" rx="4" fill="#c4855a" stroke="#8b5e3c" stroke-width="1"/>

              <!-- ── BODY / TORSO ── -->
              <rect x="25" y="57" width="50" height="70" rx="10" fill="#2c1a0e" stroke="#5c3a1a" stroke-width="1.5"/>
              <!-- Shirt collar -->
              <path d="M42 57 L50 66 L58 57" fill="none" stroke="#8b5e3c" stroke-width="1.5"/>
              <!-- Torso stitching lines -->
              <path d="M25 72 L75 72" stroke="#5c3a1a" stroke-width="1" stroke-dasharray="4,3"/>
              <path d="M25 90 L75 90" stroke="#5c3a1a" stroke-width="1" stroke-dasharray="4,3"/>
              <path d="M25 108 L75 108" stroke="#5c3a1a" stroke-width="1" stroke-dasharray="4,3"/>
              <!-- Heart stitch -->
              <path d="M44 78 Q50 72 56 78 Q62 84 50 95 Q38 84 44 78" stroke="#cc0000" stroke-width="1.5" fill="none"/>

              <!-- ── PINS / NEEDLES ── -->
              <line x1="34" y1="66" x2="36" y2="56" stroke="#d0d0d0" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="36" cy="55" r="2.5" fill="#ff0000"/>
              <line x1="66" y1="72" x2="68" y2="62" stroke="#d0d0d0" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="68" cy="61" r="2.5" fill="#ff0000"/>
              <line x1="50" y1="102" x2="52" y2="92" stroke="#d0d0d0" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="52" cy="91" r="2.5" fill="#ff0000"/>

              <!-- ── LEFT ARM ── -->
              <rect x="1"  y="59" width="24" height="13" rx="6" fill="#c4855a" stroke="#8b5e3c" stroke-width="1.5" transform="rotate(-10 13 65)"/>
              <circle cx="3" cy="64" r="6" fill="#c4855a" stroke="#8b5e3c" stroke-width="1.5"/>
              <!-- ── RIGHT ARM ── -->
              <rect x="75" y="59" width="24" height="13" rx="6" fill="#c4855a" stroke="#8b5e3c" stroke-width="1.5" transform="rotate(10 87 65)"/>
              <circle cx="97" cy="64" r="6" fill="#c4855a" stroke="#8b5e3c" stroke-width="1.5"/>

              <!-- ── LEFT LEG ── -->
              <rect x="29" y="125" width="17" height="57" rx="8" fill="#c4855a" stroke="#8b5e3c" stroke-width="1.5"/>
              <ellipse cx="37" cy="183" rx="11" ry="6" fill="#0d0500" stroke="#000" stroke-width="1"/>
              <!-- ── RIGHT LEG ── -->
              <rect x="54" y="125" width="17" height="57" rx="8" fill="#c4855a" stroke="#8b5e3c" stroke-width="1.5"/>
              <ellipse cx="62" cy="183" rx="11" ry="6" fill="#0d0500" stroke="#000" stroke-width="1"/>

              <!-- Limb stitches -->
              <path d="M29 143 L46 143" stroke="#8b5e3c" stroke-width="1" stroke-dasharray="3,2"/>
              <path d="M54 143 L71 143" stroke="#8b5e3c" stroke-width="1" stroke-dasharray="3,2"/>
              <path d="M7 62  L18 62"  stroke="#8b5e3c" stroke-width="1" stroke-dasharray="2,2"/>
              <path d="M78 62 L89 62"  stroke="#8b5e3c" stroke-width="1" stroke-dasharray="2,2"/>
            </svg>
          </div><!-- /doll-clip-wrap -->
          <!-- Fire eating edge — rises with the clip boundary -->
          <div class="doll-fire-front"></div>
        </div><!-- /doll-wrap -->

        <!-- Typed text burns at top -->
        <div class="burning-text-container">
          <p class="ritual-label">🔥 Into the Fire 🔥</p>
          <div class="burning-text">
            @for (ch of burnChars(); track $index) {
              <span class="burn-char" [style.animation-delay]="($index * 0.05) + 's'">{{ ch }}</span>
            }
          </div>
        </div>

        <!-- Ritual verse lines — appear one by one over the doll -->
        <div class="ritual-verse-wrap" aria-live="polite">
          @for (line of VERSES; track $index) {
            <span class="ritual-verse-line"
                  [class.visible]="verseVisible().includes($index)"
                  [class.fading]="ritualPhase() === 'fading'">
              {{ line }}
            </span>
          }
        </div>

        <button class="ritual-close" (click)="closeRitual()" aria-label="Close ritual">✕</button>
      </div>
    }

    <!-- Ritual chanting audio (plays during ritual only) -->
    @if (isBrowser && burning()) {
      <iframe #ritualAudioFrame [src]="ritualMusicUrl"
        style="position:fixed;width:1px;height:1px;bottom:0;left:0;opacity:0;pointer-events:none;border:none;"
        allow="autoplay" aria-hidden="true"></iframe>
    }

    <!-- Background music iframe -->
    @if (isBrowser) {
      <iframe #musicFrame [src]="musicUrl"
        style="position:fixed;width:1px;height:1px;bottom:0;left:0;opacity:0;pointer-events:none;border:none;"
        allow="autoplay" aria-hidden="true"></iframe>
    }

    <!-- Music player -->
    <div class="music-player" role="region" aria-label="Background music player">
      <div class="music-panel">
        <p class="music-panel__title">{{ playing() ? '🎵 Now Playing' : '🎵 Music' }}</p>
        <div class="music-panel__controls">
          <button class="music-panel__btn" [class.playing]="playing()"
            (click)="toggleMusic()" [attr.aria-label]="playing() ? 'Pause' : 'Play'">
            {{ playing() ? '⏸' : '▶' }}
          </button>
          <span style="font-size:.7rem;color:var(--color-text-muted);flex:1;">{{ playing() ? 'Playing...' : 'Paused' }}</span>
        </div>
        <div class="volume-wrap">
          <span class="volume-icon" aria-hidden="true">{{ volume() === 0 ? '🔇' : volume() < 50 ? '🔉' : '🔊' }}</span>
          <input class="volume-slider" type="range" min="0" max="100" [value]="volume()"
            (input)="onVolumeChange($event)" aria-label="Volume" />
          <span class="volume-value">{{ volume() }}%</span>
        </div>
      </div>
    </div>
  `,
})
export class App implements AfterViewInit, OnDestroy {
  private readonly sanitizer   = inject(DomSanitizer);
  private readonly platformId  = inject(PLATFORM_ID);
  @ViewChild('musicFrame') musicFrame?: ElementRef<HTMLIFrameElement>;

  readonly chapters  = CHAPTERS;
  readonly embers    = EMBER_DATA;
  readonly smokes    = SMOKE_DATA;
  readonly isBrowser = isPlatformBrowser(this.platformId);

  // Music
  readonly playing = signal(true);
  readonly volume  = signal(50);
  readonly musicUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.youtube.com/embed/jOTeBVtlnXU?autoplay=1&loop=1&playlist=jOTeBVtlnXU&controls=0&rel=0&enablejsapi=1'
  );

  // Ritual
  readonly ritualText   = signal('');
  readonly activeText   = signal('');
  readonly burning      = signal(false);
  readonly ritualPhase  = signal<'idle'|'igniting'|'burning'|'fading'>('idle');
  readonly burnChars    = computed(() => [...this.activeText()]);
  readonly verseVisible = signal<number[]>([]);  // indices of visible verse lines

  readonly VERSES = [
    'By ancient flame, I call the pyre,',
    'Let what is named return to fire.',
    'The flesh of cloth, the bones of thread —',
    'all that was bound shall now be shed.',
    'Ash to ash, smoke to the sky,',
    'what cannot change, must surely die.',
    'So it is spoken. So it burns.',
  ];

  @ViewChild('ritualAudioFrame') ritualAudioFrame?: ElementRef<HTMLIFrameElement>;

  private audioCtx?: AudioContext;
  private masterGain?: GainNode;
  private popInterval?: ReturnType<typeof setInterval>;
  private autoEndTimer?: ReturnType<typeof setTimeout>;
  private ritualTimer?: ReturnType<typeof setTimeout>;
  private verseTimers: ReturnType<typeof setTimeout>[] = [];

  readonly dollFaceUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/zarif.jpg');

  readonly ritualMusicUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.youtube.com/embed/9TT23hkwfw0?autoplay=1&loop=1&playlist=9TT23hkwfw0&controls=0&rel=0&enablejsapi=1&start=10'
  );

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    setTimeout(() => this.sendVolume(this.volume()), 3000);
  }

  ngOnDestroy(): void {
    this.stopRitualAudio();
    this.verseTimers.forEach(t => clearTimeout(t));
    if (this.ritualTimer)  clearTimeout(this.ritualTimer);
    if (this.autoEndTimer) clearTimeout(this.autoEndTimer);
  }

  stopRitualMusic(): void {
    this.ritualAudioFrame?.nativeElement.contentWindow?.postMessage(
      JSON.stringify({ event:'command', func:'pauseVideo', args:[] }), '*'
    );
  }

  /* ── Ritual ─────────────────────────────────────────────── */
  startRitual(): void {
    if (!this.isBrowser) return;
    const text = this.ritualText().trim();
    if (!text) return;

    this.activeText.set(text);
    this.verseVisible.set([]);
    this.burning.set(true);
    this.ritualPhase.set('igniting');
    this.startRitualAudio();

    // Circle pops → burning phase starts
    this.ritualTimer = setTimeout(() => {
      this.ritualPhase.set('burning');
      this.scheduleVerses();
    }, 1400);

    // Auto-close after all verses + doll burn complete (~18s)
    this.autoEndTimer = setTimeout(() => this.fadeOutRitual(), 18000);
  }

  private scheduleVerses(): void {
    // Show each verse line one at a time, ~2s apart
    this.VERSES.forEach((_, i) => {
      const t = setTimeout(() => {
        this.verseVisible.update(v => [...v, i]);
      }, i * 2000);
      this.verseTimers.push(t);
    });
  }

  private fadeOutRitual(): void {
    this.verseTimers.forEach(t => clearTimeout(t));
    this.verseTimers = [];
    this.ritualPhase.set('fading');
    this.ritualTimer = setTimeout(() => {
      this.burning.set(false);
      this.ritualPhase.set('idle');
      this.verseVisible.set([]);
      this.stopRitualAudio();
      this.stopRitualMusic();
    }, 2000);
  }

  closeRitual(): void {
    if (this.autoEndTimer) { clearTimeout(this.autoEndTimer); this.autoEndTimer = undefined; }
    this.fadeOutRitual();
  }

  /* ══ RITUAL AUDIO — Web Audio layered soundscape ══════════
     Layer 1: Roaring fire base (brown noise → bandpass)
     Layer 2: Deep infrasonic rumble (sawtooth → lowpass)
     Layer 3: Ritual drone choir (4 sine oscillators + LFO)
     Layer 4: Random crackle pops
     Layer 5: Whoosh surge on ignition
  ══════════════════════════════════════════════════════════ */
  startRitualAudio(): void {
    if (!this.isBrowser) return;
    try {
      this.stopRitualAudio();
      this.audioCtx  = new AudioContext();
      const ctx      = this.audioCtx;
      const now      = ctx.currentTime;

      const master   = ctx.createGain();
      master.gain.setValueAtTime(0, now);
      master.gain.linearRampToValueAtTime(0.8, now + 1.5);
      master.connect(ctx.destination);
      this.masterGain = master;

      /* ── Layer 1: Fire roar (brown noise) ─────────────── */
      const fireBuf = this.brownNoise(ctx, 6);
      const fireNoise = ctx.createBufferSource();
      fireNoise.buffer = fireBuf; fireNoise.loop = true;

      const fireBp1 = ctx.createBiquadFilter();
      fireBp1.type = 'bandpass'; fireBp1.frequency.value = 400; fireBp1.Q.value = 0.4;
      const fireBp2 = ctx.createBiquadFilter();
      fireBp2.type = 'bandpass'; fireBp2.frequency.value = 900; fireBp2.Q.value = 0.6;
      const fireGn  = ctx.createGain(); fireGn.gain.value = 0.55;

      fireNoise.connect(fireBp1); fireBp1.connect(fireGn);
      fireNoise.connect(fireBp2); fireBp2.connect(fireGn);
      fireGn.connect(master);
      fireNoise.start();

      /* ── Layer 2: Infrasonic rumble ───────────────────── */
      const rumble = ctx.createOscillator();
      rumble.type = 'sawtooth';
      rumble.frequency.setValueAtTime(38, now);
      rumble.frequency.linearRampToValueAtTime(28, now + 4);

      const rumbleLp = ctx.createBiquadFilter();
      rumbleLp.type = 'lowpass'; rumbleLp.frequency.value = 80;
      const rumbleGn = ctx.createGain(); rumbleGn.gain.value = 0.18;
      rumble.connect(rumbleLp); rumbleLp.connect(rumbleGn); rumbleGn.connect(master);
      rumble.start();

      /* Layer 3 (drone) removed */

      /* ── Layer 4: Ignition WHOOSH surge ───────────────── */
      const whooshBuf  = this.brownNoise(ctx, 1.5);
      const whoosh     = ctx.createBufferSource();
      whoosh.buffer    = whooshBuf;
      const whooshHp   = ctx.createBiquadFilter();
      whooshHp.type    = 'highpass'; whooshHp.frequency.value = 200;
      const whooshGain = ctx.createGain();
      whooshGain.gain.setValueAtTime(0, now);
      whooshGain.gain.linearRampToValueAtTime(1.2, now + 0.4);
      whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      whoosh.connect(whooshHp); whooshHp.connect(whooshGain); whooshGain.connect(master);
      whoosh.start(); whoosh.stop(now + 1.5);

      /* ── Layer 5: Crackle pops ────────────────────────── */
      this.popInterval = setInterval(() => {
        if (!this.audioCtx || this.audioCtx.state === 'closed') return;
        const pop  = ctx.createOscillator();
        const pGn  = ctx.createGain();
        pop.type             = 'square';
        pop.frequency.value  = 100 + Math.random() * 900;
        const t = ctx.currentTime;
        pGn.gain.setValueAtTime(0.09 + Math.random() * 0.11, t);
        pGn.gain.exponentialRampToValueAtTime(0.0001, t + 0.04 + Math.random() * 0.04);
        pop.connect(pGn); pGn.connect(master);
        pop.start(t); pop.stop(t + 0.08);
      }, 80 + Math.random() * 150);

    } catch { /* AudioContext not available */ }
  }

  stopRitualAudio(): void {
    if (this.popInterval) { clearInterval(this.popInterval); this.popInterval = undefined; }
    if (this.masterGain && this.audioCtx) {
      try {
        this.masterGain.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.5);
        setTimeout(() => { this.audioCtx?.close(); this.audioCtx = undefined; }, 1200);
      } catch { /* ignore */ }
    }
  }

  /** Generate brown noise buffer of `seconds` duration */
  private brownNoise(ctx: AudioContext, seconds: number): AudioBuffer {
    const len  = Math.floor(ctx.sampleRate * seconds);
    const buf  = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last   = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      data[i] = (last + 0.02 * w) / 1.02;
      last    = data[i];
      data[i] *= 3.5;
    }
    return buf;
  }

  /* ── Music ──────────────────────────────────────────────── */
  toggleMusic(): void {
    const f = this.musicFrame?.nativeElement;
    if (!f) return;
    const cmd = this.playing() ? 'pauseVideo' : 'playVideo';
    f.contentWindow?.postMessage(JSON.stringify({ event:'command', func:cmd, args:[] }), '*');
    this.playing.update(v => !v);
  }

  onVolumeChange(e: Event): void {
    const v = Number((e.target as HTMLInputElement).value);
    this.volume.set(v);
    this.sendVolume(v);
  }

  private sendVolume(v: number): void {
    this.musicFrame?.nativeElement.contentWindow?.postMessage(
      JSON.stringify({ event:'command', func:'setVolume', args:[v] }), '*'
    );
  }

  getVal(e: Event): string { return (e.target as HTMLInputElement).value; }

  safeUrl(id: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`
    );
  }
}
