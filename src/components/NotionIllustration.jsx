import React from 'react';

/**
 * NotionIllustration Component
 * Renders bespoke Notion-style hand-drawn vector illustrations
 * with earthy ink lines, warm sand/clay tints, and poetic motifs.
 */
const NotionIllustration = ({ name, className = '', aspect = 'aspect-[4/3]' }) => {
  const illustrations = {
    // 1. Solitude & Window: Person by window at night with crescent moon and warm tea
    'solitude-window': (
      <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#FDFCF9" />
        {/* Soft background tint */}
        <circle cx="280" cy="110" r="70" fill="#EDE8E0" />
        <path d="M 280,50 A 60,60 0 1 0 340,110 A 50,50 0 1 1 280,50 Z" fill="#C4A882" opacity="0.35" />
        {/* Window frame */}
        <rect x="50" y="40" width="160" height="190" rx="4" fill="#F8F5F0" stroke="#1C1917" strokeWidth="2.5" />
        <line x1="130" y1="40" x2="130" y2="230" stroke="#1C1917" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="50" y1="135" x2="210" y2="135" stroke="#1C1917" strokeWidth="1.5" />
        {/* Stars outside window */}
        <circle cx="85" cy="75" r="2.5" fill="#9C6B3C" />
        <circle cx="170" cy="90" r="2" fill="#9C6B3C" />
        <circle cx="105" cy="110" r="1.5" fill="#1C1917" />
        <path d="M 155,60 L 158,66 L 164,68 L 158,70 L 155,76 L 152,70 L 146,68 L 152,66 Z" fill="#C4A882" />
        {/* Window sill */}
        <rect x="40" y="230" width="180" height="10" rx="2" fill="#EDE8E0" stroke="#1C1917" strokeWidth="2.5" />
        {/* Potted plant on sill */}
        <path d="M 65,230 L 70,210 L 88,210 L 93,230 Z" fill="#9C6B3C" opacity="0.25" stroke="#1C1917" strokeWidth="2" />
        <path d="M 79,210 Q 75,190 65,195 Q 78,198 79,210" fill="#5C6B4A" stroke="#1C1917" strokeWidth="1.5" />
        <path d="M 79,210 Q 85,185 96,192 Q 86,196 79,210" fill="#5C6B4A" stroke="#1C1917" strokeWidth="1.5" />
        {/* Steaming tea mug */}
        <rect x="180" y="215" width="16" height="15" rx="2" fill="#FDFCF9" stroke="#1C1917" strokeWidth="1.8" />
        <path d="M 196,218 Q 202,222 196,226" stroke="#1C1917" strokeWidth="1.5" fill="none" />
        <path d="M 185,210 Q 183,205 186,200" stroke="#9C6B3C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Solitary figure sitting reading */}
        <ellipse cx="270" cy="245" rx="35" ry="12" fill="#E0D9CE" opacity="0.5" />
        {/* Torso & Head */}
        <circle cx="270" cy="165" r="14" fill="#FDFCF9" stroke="#1C1917" strokeWidth="2.5" />
        {/* Hair in Notion style */}
        <path d="M 260,165 Q 262,150 274,152 Q 282,155 284,166 Q 278,160 270,161 Z" fill="#1C1917" />
        {/* Body curve */}
        <path d="M 265,180 Q 255,200 250,230 Q 275,232 290,230 Q 285,200 275,180 Z" fill="#EDE8E0" stroke="#1C1917" strokeWidth="2.5" />
        {/* Book in hands */}
        <path d="M 245,205 L 260,215 L 275,205 L 275,220 L 260,230 L 245,220 Z" fill="#FDFCF9" stroke="#1C1917" strokeWidth="2" />
        <line x1="260" y1="215" x2="260" y2="230" stroke="#1C1917" strokeWidth="1.5" />
      </svg>
    ),

    // 2. Midnight Love / Nocturne: Intertwined starlight, moon, abstract poetic silhouettes
    'midnight-love': (
      <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#FDFCF9" />
        <circle cx="200" cy="140" r="85" fill="#F3EFE8" />
        <circle cx="200" cy="140" r="60" fill="#EDE8E0" />
        {/* Giant gentle moon */}
        <path d="M 180,80 A 55,55 0 0 0 235,135 A 45,45 0 1 1 180,80 Z" fill="#9C6B3C" opacity="0.3" stroke="#1C1917" strokeWidth="1.5" />
        {/* Twinkling Notion stars */}
        <path d="M 110,90 L 112,96 L 118,98 L 112,100 L 110,106 L 108,100 L 102,98 L 108,96 Z" fill="#9C6B3C" />
        <path d="M 290,80 L 292,86 L 298,88 L 292,90 L 290,96 L 288,90 L 282,88 L 288,86 Z" fill="#1C1917" />
        <circle cx="140" cy="140" r="2" fill="#1C1917" />
        <circle cx="260" cy="160" r="2.5" fill="#9C6B3C" />
        {/* Two figures under the night sky */}
        <g transform="translate(145, 130)">
          {/* Figure 1 */}
          <circle cx="35" cy="30" r="11" fill="#FDFCF9" stroke="#1C1917" strokeWidth="2.2" />
          <path d="M 26,28 Q 28,18 38,20 Q 46,23 46,31 Z" fill="#1C1917" />
          <path d="M 30,42 Q 22,60 20,85 Q 45,86 52,85 Q 46,58 38,42 Z" fill="#FDFCF9" stroke="#1C1917" strokeWidth="2.2" />
          {/* Figure 2 leaning close */}
          <circle cx="65" cy="36" r="10" fill="#FDFCF9" stroke="#1C1917" strokeWidth="2.2" />
          <path d="M 57,34 Q 60,24 70,26 Q 76,30 75,37 Z" fill="#9C6B3C" />
          <path d="M 60,47 Q 54,65 52,85 Q 75,86 82,85 Q 76,62 68,47 Z" fill="#EDE8E0" stroke="#1C1917" strokeWidth="2.2" />
          {/* Joined hands / shared heart flower */}
          <path d="M 50,65 Q 54,58 58,65 Q 54,72 50,65 Z" fill="#9C6B3C" stroke="#1C1917" strokeWidth="1.5" />
        </g>
        {/* Horizon hill curve */}
        <path d="M 50,260 Q 200,225 350,260" stroke="#1C1917" strokeWidth="2" fill="none" />
      </svg>
    ),

    // 3. Letters to Younger Self: Antique writing desk, letters, candle, hourglass
    'letters-desk': (
      <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#FDFCF9" />
        <rect x="70" y="170" width="260" height="8" rx="2" fill="#EDE8E0" stroke="#1C1917" strokeWidth="2.5" />
        <line x1="100" y1="178" x2="95" y2="250" stroke="#1C1917" strokeWidth="2.5" />
        <line x1="300" y1="178" x2="305" y2="250" stroke="#1C1917" strokeWidth="2.5" />
        {/* Open journal */}
        <path d="M 140,140 Q 170,145 195,140 L 195,168 Q 170,172 140,168 Z" fill="#FDFCF9" stroke="#1C1917" strokeWidth="2" />
        <path d="M 195,140 Q 220,145 250,140 L 250,168 Q 220,172 195,168 Z" fill="#F8F5F0" stroke="#1C1917" strokeWidth="2" />
        {/* Text lines in journal */}
        <line x1="150" y1="148" x2="185" y2="148" stroke="#78716C" strokeWidth="1.2" />
        <line x1="150" y1="154" x2="182" y2="154" stroke="#78716C" strokeWidth="1.2" />
        <line x1="150" y1="160" x2="175" y2="160" stroke="#78716C" strokeWidth="1.2" />
        <line x1="205" y1="148" x2="240" y2="148" stroke="#78716C" strokeWidth="1.2" />
        <line x1="205" y1="154" x2="238" y2="154" stroke="#78716C" strokeWidth="1.2" />
        <line x1="205" y1="160" x2="225" y2="160" stroke="#78716C" strokeWidth="1.2" />
        {/* Inkwell and quill */}
        <rect x="265" y="152" width="14" height="16" rx="2" fill="#1C1917" />
        <path d="M 272,152 Q 285,120 295,105 Q 292,122 274,152" fill="#C4A882" stroke="#1C1917" strokeWidth="1.5" />
        {/* Stack of folded letters with wax seal */}
        <rect x="100" y="154" width="32" height="15" rx="1" fill="#EDE8E0" stroke="#1C1917" strokeWidth="1.8" />
        <rect x="98" y="148" width="32" height="15" rx="1" fill="#FDFCF9" stroke="#1C1917" strokeWidth="1.8" />
        <circle cx="114" cy="155" r="3.5" fill="#9C6B3C" />
        {/* Candle with warm flame */}
        <rect x="120" y="105" width="10" height="28" fill="#FDFCF9" stroke="#1C1917" strokeWidth="1.8" />
        <path d="M 125,105 Q 128,95 125,90 Q 122,95 125,105 Z" fill="#9C6B3C" stroke="#1C1917" strokeWidth="1.2" />
        <circle cx="125" cy="94" r="12" fill="#C4A882" opacity="0.25" />
        {/* Floating paper airplane whispering across time */}
        <path d="M 270,70 L 320,60 L 290,95 Z" fill="#FDFCF9" stroke="#1C1917" strokeWidth="2" />
        <line x1="270" y1="70" x2="295" y2="80" stroke="#1C1917" strokeWidth="1.5" />
        <path d="M 240,85 Q 255,75 270,70" stroke="#9C6B3C" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
      </svg>
    ),

    // 4. Weight of Words: Vintage typewriter with floating manuscript pages
    'typewriter-craft': (
      <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#FDFCF9" />
        <ellipse cx="200" cy="225" rx="110" ry="25" fill="#EDE8E0" opacity="0.6" />
        {/* Typewriter body */}
        <path d="M 130,175 L 145,140 L 255,140 L 270,175 L 265,210 L 135,210 Z" fill="#F3EFE8" stroke="#1C1917" strokeWidth="2.5" />
        {/* Carriage & roller */}
        <rect x="120" y="125" width="160" height="15" rx="3" fill="#1C1917" />
        <circle cx="118" cy="132" r="6" fill="#C4A882" stroke="#1C1917" strokeWidth="1.8" />
        <circle cx="282" cy="132" r="6" fill="#C4A882" stroke="#1C1917" strokeWidth="1.8" />
        {/* Paper sheet rising from typewriter */}
        <path d="M 160,70 L 240,65 L 235,130 L 165,130 Z" fill="#FDFCF9" stroke="#1C1917" strokeWidth="2" />
        <line x1="175" y1="85" x2="225" y2="82" stroke="#1C1917" strokeWidth="1.5" />
        <line x1="175" y1="95" x2="220" y2="92" stroke="#1C1917" strokeWidth="1.5" />
        <line x1="175" y1="105" x2="210" y2="102" stroke="#78716C" strokeWidth="1.5" />
        {/* Keyboard keys rows */}
        <rect x="145" y="165" width="110" height="35" rx="2" fill="#EDE8E0" stroke="#1C1917" strokeWidth="1.5" />
        <circle cx="158" cy="174" r="3" fill="#1C1917" />
        <circle cx="172" cy="174" r="3" fill="#1C1917" />
        <circle cx="186" cy="174" r="3" fill="#9C6B3C" />
        <circle cx="200" cy="174" r="3" fill="#1C1917" />
        <circle cx="214" cy="174" r="3" fill="#1C1917" />
        <circle cx="228" cy="174" r="3" fill="#1C1917" />
        <circle cx="242" cy="174" r="3" fill="#1C1917" />
        <circle cx="165" cy="188" r="3" fill="#1C1917" />
        <circle cx="179" cy="188" r="3" fill="#1C1917" />
        <circle cx="193" cy="188" r="3" fill="#1C1917" />
        <circle cx="207" cy="188" r="3" fill="#9C6B3C" />
        <circle cx="221" cy="188" r="3" fill="#1C1917" />
        <circle cx="235" cy="188" r="3" fill="#1C1917" />
        {/* Spacebar */}
        <rect x="180" y="196" width="40" height="3" rx="1" fill="#1C1917" />
        {/* Floating leaves of poetry */}
        <path d="M 270,80 Q 285,75 295,85 Q 285,95 270,80 Z" fill="#5C6B4A" opacity="0.4" stroke="#1C1917" strokeWidth="1.2" />
        <path d="M 115,95 Q 100,90 95,102 Q 110,108 115,95 Z" fill="#9C6B3C" opacity="0.4" stroke="#1C1917" strokeWidth="1.2" />
      </svg>
    ),

    // 5. Dancing with Shadows: Delicate silhouette figure dancing with subtle shadow
    'dancing-shadows': (
      <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#FDFCF9" />
        {/* Sun/Moon aura */}
        <circle cx="200" cy="130" r="75" fill="#EDE8E0" opacity="0.6" />
        {/* Classical arch */}
        <path d="M 120,240 L 120,130 A 80,80 0 0 1 280,130 L 280,240" fill="none" stroke="#E0D9CE" strokeWidth="2.5" />
        {/* Cast shadow figure on floor/wall */}
        <g transform="translate(160, 80) skewX(-20) scale(0.9, 0.9)" opacity="0.25">
          <circle cx="50" cy="40" r="12" fill="#1C1917" />
          <path d="M 50,55 Q 35,95 40,140 Q 60,140 65,95 Z" fill="#1C1917" />
          <path d="M 45,70 Q 20,60 10,75" stroke="#1C1917" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 55,70 Q 80,55 90,40" stroke="#1C1917" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
        {/* Dancing Main Figure */}
        <g transform="translate(180, 75)">
          <circle cx="30" cy="35" r="11" fill="#FDFCF9" stroke="#1C1917" strokeWidth="2.5" />
          {/* Hair knot */}
          <circle cx="23" cy="30" r="5" fill="#1C1917" />
          {/* Flowing dress & torso */}
          <path d="M 30,48 Q 20,70 12,120 Q 35,130 58,115 Q 45,70 34,48 Z" fill="#FDFCF9" stroke="#1C1917" strokeWidth="2.5" />
          {/* Accent scarf */}
          <path d="M 28,52 Q 40,65 52,58 Q 50,75 42,85" stroke="#9C6B3C" strokeWidth="2" fill="none" />
          {/* Graceful arms */}
          <path d="M 26,60 Q 5,45 -5,55" stroke="#1C1917" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M 34,60 Q 55,45 68,30" stroke="#1C1917" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </g>
        {/* Ground line */}
        <line x1="80" y1="230" x2="320" y2="230" stroke="#1C1917" strokeWidth="2" />
      </svg>
    ),

    // 6. Quiet Revolution / Inner Growth: A sprout blossoming from an open book into starry sky
    'quiet-revolution': (
      <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#FDFCF9" />
        <circle cx="200" cy="150" r="90" fill="#F3EFE8" />
        {/* Giant plant emerging from book */}
        <path d="M 200,210 Q 195,150 170,110 Q 190,130 200,210" fill="#5C6B4A" opacity="0.3" />
        <path d="M 200,210 Q 205,140 230,95 Q 210,125 200,210" fill="#5C6B4A" opacity="0.3" />
        <path d="M 200,215 Q 195,140 200,70" stroke="#1C1917" strokeWidth="2.5" fill="none" />
        {/* Leaves */}
        <path d="M 198,160 Q 160,150 155,130 Q 180,135 198,160" fill="#5C6B4A" stroke="#1C1917" strokeWidth="2" />
        <path d="M 200,130 Q 240,120 245,100 Q 220,105 200,130" fill="#8A9E82" stroke="#1C1917" strokeWidth="2" />
        <path d="M 199,95 Q 170,80 175,60 Q 195,70 199,95" fill="#5C6B4A" stroke="#1C1917" strokeWidth="2" />
        {/* Flower / Star at top */}
        <circle cx="200" cy="65" r="7" fill="#9C6B3C" stroke="#1C1917" strokeWidth="2" />
        {/* Pedestal / Open foundation book */}
        <path d="M 130,210 Q 170,218 200,215 Q 230,218 270,210 L 270,230 Q 230,238 200,235 Q 170,238 130,230 Z" fill="#FDFCF9" stroke="#1C1917" strokeWidth="2.5" />
        <line x1="200" y1="215" x2="200" y2="235" stroke="#1C1917" strokeWidth="2" />
        {/* Sparkles of insight */}
        <circle cx="140" cy="90" r="2.5" fill="#9C6B3C" />
        <circle cx="260" cy="75" r="2" fill="#1C1917" />
        <circle cx="275" cy="130" r="2" fill="#9C6B3C" />
      </svg>
    ),

    // 7. Conversations with the Moon: Figure on a hill speaking to the night sky
    'conversations-moon': (
      <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#FDFCF9" />
        {/* Oversized textured moon */}
        <circle cx="260" cy="100" r="55" fill="#EDE8E0" stroke="#1C1917" strokeWidth="2.5" />
        <circle cx="245" cy="85" r="10" fill="#D6C9B6" opacity="0.6" />
        <circle cx="275" cy="115" r="14" fill="#D6C9B6" opacity="0.5" />
        <circle cx="280" cy="78" r="6" fill="#D6C9B6" opacity="0.5" />
        {/* Stars */}
        <circle cx="100" cy="70" r="2" fill="#1C1917" />
        <circle cx="140" cy="50" r="2.5" fill="#9C6B3C" />
        <circle cx="180" cy="85" r="1.5" fill="#1C1917" />
        <circle cx="80" cy="130" r="2" fill="#9C6B3C" />
        {/* Rolling hillside in Notion contour */}
        <path d="M 0,260 Q 150,200 400,250 L 400,300 L 0,300 Z" fill="#F3EFE8" stroke="#1C1917" strokeWidth="2.5" />
        {/* Solitary figure standing looking at moon */}
        <g transform="translate(130, 160)">
          <circle cx="20" cy="15" r="8" fill="#FDFCF9" stroke="#1C1917" strokeWidth="2.2" />
          <path d="M 18,24 L 14,58 L 26,58 L 22,24 Z" fill="#1C1917" />
          <line x1="16" y1="58" x2="14" y2="78" stroke="#1C1917" strokeWidth="2.2" />
          <line x1="24" y1="58" x2="26" y2="78" stroke="#1C1917" strokeWidth="2.2" />
          {/* Raised hand greeting moon */}
          <path d="M 21,30 Q 32,22 40,16" stroke="#1C1917" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
        {/* Gentle wind / speech breeze */}
        <path d="M 180,180 Q 210,160 235,165" stroke="#9C6B3C" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
      </svg>
    ),

    // 8. Art of Letting Go: Releasing paper cranes into the horizon
    'letting-go': (
      <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#FDFCF9" />
        <circle cx="200" cy="140" r="80" fill="#EDE8E0" opacity="0.4" />
        {/* Hands reaching up */}
        <path d="M 130,260 Q 145,210 160,180 Q 166,170 172,175 Q 170,195 155,260" fill="#FDFCF9" stroke="#1C1917" strokeWidth="2.5" />
        <path d="M 148,188 Q 155,165 162,168 Q 162,185 152,198" fill="#FDFCF9" stroke="#1C1917" strokeWidth="2" />
        {/* Origami Birds taking flight */}
        {/* Bird 1 */}
        <g transform="translate(180, 120)">
          <path d="M 0,15 L 20,0 L 35,20 L 15,18 Z" fill="#FDFCF9" stroke="#1C1917" strokeWidth="2" />
          <line x1="0" y1="15" x2="35" y2="20" stroke="#1C1917" strokeWidth="1.5" />
        </g>
        {/* Bird 2 */}
        <g transform="translate(230, 80) scale(0.85)">
          <path d="M 0,15 L 20,0 L 35,20 L 15,18 Z" fill="#EDE8E0" stroke="#1C1917" strokeWidth="2" />
          <line x1="0" y1="15" x2="35" y2="20" stroke="#1C1917" strokeWidth="1.5" />
        </g>
        {/* Bird 3 (Small distant) */}
        <g transform="translate(280, 50) scale(0.65)">
          <path d="M 0,15 L 20,0 L 35,20 L 15,18 Z" fill="#9C6B3C" opacity="0.5" stroke="#1C1917" strokeWidth="2" />
          <line x1="0" y1="15" x2="35" y2="20" stroke="#1C1917" strokeWidth="1.5" />
        </g>
        {/* Wind motion trail */}
        <path d="M 160,190 Q 210,130 290,55" stroke="#9C6B3C" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
      </svg>
    ),

    // 9. Architecture of Silence: Japanese screen, bonsai, calm stone
    'architecture-silence': (
      <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#FDFCF9" />
        {/* Shoji screen grid */}
        <rect x="60" y="40" width="140" height="200" fill="#F8F5F0" stroke="#1C1917" strokeWidth="2.5" />
        <line x1="60" y1="90" x2="200" y2="90" stroke="#1C1917" strokeWidth="1.5" />
        <line x1="60" y1="140" x2="200" y2="140" stroke="#1C1917" strokeWidth="1.5" />
        <line x1="60" y1="190" x2="200" y2="190" stroke="#1C1917" strokeWidth="1.5" />
        <line x1="106" y1="40" x2="106" y2="240" stroke="#1C1917" strokeWidth="1.5" />
        <line x1="153" y1="40" x2="153" y2="240" stroke="#1C1917" strokeWidth="1.5" />
        {/* Ceramic vase with delicate branch */}
        <path d="M 260,230 L 265,190 L 290,190 L 295,230 Z" fill="#9C6B3C" opacity="0.3" stroke="#1C1917" strokeWidth="2.2" />
        <path d="M 278,190 Q 275,140 250,110 Q 265,115 278,135 Q 295,100 315,90" stroke="#1C1917" strokeWidth="2" fill="none" />
        {/* Delicate leaves on branch */}
        <ellipse cx="250" cy="110" rx="6" ry="3" transform="rotate(-30 250 110)" fill="#5C6B4A" stroke="#1C1917" strokeWidth="1.2" />
        <ellipse cx="265" cy="115" rx="6" ry="3" transform="rotate(20 265 115)" fill="#5C6B4A" stroke="#1C1917" strokeWidth="1.2" />
        <ellipse cx="295" cy="100" rx="7" ry="3" transform="rotate(-15 295 100)" fill="#5C6B4A" stroke="#1C1917" strokeWidth="1.2" />
        <ellipse cx="315" cy="90" rx="5" ry="3" transform="rotate(40 315 90)" fill="#8A9E82" stroke="#1C1917" strokeWidth="1.2" />
        {/* Floor mat / Tatami edge */}
        <line x1="40" y1="240" x2="360" y2="240" stroke="#1C1917" strokeWidth="2.5" />
        <rect x="40" y="242" width="320" height="15" fill="#EDE8E0" />
      </svg>
    ),

    // 10. Podcast / Audio Dispatch: Figure with headphones beside poetry books
    'audio-dispatch': (
      <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill="#FDFCF9" />
        <circle cx="200" cy="190" r="110" fill="#EDE8E0" opacity="0.5" />
        {/* Vinyl Record */}
        <circle cx="280" cy="150" r="60" fill="#1C1917" />
        <circle cx="280" cy="150" r="22" fill="#9C6B3C" stroke="#FDFCF9" strokeWidth="2" />
        <circle cx="280" cy="150" r="5" fill="#1C1917" />
        {/* Contemplative listener with headphones */}
        <g transform="translate(110, 110)">
          {/* Head */}
          <circle cx="50" cy="40" r="18" fill="#FDFCF9" stroke="#1C1917" strokeWidth="2.5" />
          {/* Hair */}
          <path d="M 38,40 Q 40,24 55,26 Q 66,30 65,42 Z" fill="#1C1917" />
          {/* Headphones band */}
          <path d="M 32,40 A 20,20 0 0 1 68,40" stroke="#1C1917" strokeWidth="3" fill="none" />
          {/* Ear pads */}
          <rect x="30" y="34" width="7" height="15" rx="3" fill="#9C6B3C" stroke="#1C1917" strokeWidth="1.8" />
          <rect x="63" y="34" width="7" height="15" rx="3" fill="#9C6B3C" stroke="#1C1917" strokeWidth="1.8" />
          {/* Torso */}
          <path d="M 44,58 Q 30,85 25,130 Q 60,132 80,130 Q 72,85 58,58 Z" fill="#FDFCF9" stroke="#1C1917" strokeWidth="2.5" />
        </g>
        {/* Stack of books beside */}
        <g transform="translate(60, 240)">
          <rect x="0" y="30" width="80" height="18" rx="2" fill="#9C6B3C" opacity="0.4" stroke="#1C1917" strokeWidth="2" />
          <rect x="5" y="14" width="70" height="16" rx="2" fill="#5C6B4A" opacity="0.4" stroke="#1C1917" strokeWidth="2" />
          <rect x="10" y="0" width="60" height="14" rx="2" fill="#EDE8E0" stroke="#1C1917" strokeWidth="2" />
        </g>
        {/* Soundwaves / thought waves in Notion style */}
        <path d="M 200,90 Q 215,80 230,90" stroke="#9C6B3C" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 190,75 Q 215,60 240,75" stroke="#9C6B3C" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    ),

    // 11. Hero Cover Feature: Vast starry horizon with solitary thinker under ancient bough
    'hero-solitude': (
      <svg viewBox="0 0 1200 700" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="700" fill="#1C1917" />
        {/* Subtle warm paper texture backdrop */}
        <circle cx="850" cy="280" r="280" fill="#292524" />
        {/* Giant textured crescent moon */}
        <path d="M 850,120 A 180,180 0 0 0 1020,300 A 150,150 0 1 1 850,120 Z" fill="#EDE8E0" opacity="0.85" />
        {/* Constellations and Notion stars */}
        <g fill="#C4A882">
          <circle cx="200" cy="120" r="3.5" />
          <circle cx="340" cy="180" r="2.5" />
          <circle cx="480" cy="90" r="4" />
          <circle cx="620" cy="160" r="3" />
          <circle cx="280" cy="260" r="2.5" />
          <circle cx="420" cy="240" r="3.5" />
          <circle cx="720" cy="80" r="3" />
          <circle cx="950" cy="100" r="4" />
          <circle cx="1080" cy="200" r="3" />
        </g>
        {/* Delicate constellation connecting lines */}
        <line x1="200" y1="120" x2="340" y2="180" stroke="#C4A882" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.4" />
        <line x1="340" y1="180" x2="420" y2="240" stroke="#C4A882" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.4" />
        <line x1="480" y1="90" x2="620" y2="160" stroke="#C4A882" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.4" />
        {/* Ancient tree branch arching overhead */}
        <path d="M 0,380 Q 200,280 450,260 Q 650,250 800,320" stroke="#EDE8E0" strokeWidth="4" fill="none" opacity="0.75" />
        <path d="M 280,270 Q 320,200 400,180" stroke="#EDE8E0" strokeWidth="2.5" fill="none" opacity="0.6" />
        {/* Stylized leaves */}
        <ellipse cx="400" cy="180" rx="14" ry="7" transform="rotate(-20 400 180)" fill="#5C6B4A" opacity="0.6" />
        <ellipse cx="420" cy="190" rx="12" ry="6" transform="rotate(30 420 190)" fill="#8A9E82" opacity="0.6" />
        <ellipse cx="450" cy="260" rx="16" ry="8" transform="rotate(-15 450 260)" fill="#9C6B3C" opacity="0.5" />
        <ellipse cx="580" cy="265" rx="15" ry="7" transform="rotate(15 580 265)" fill="#5C6B4A" opacity="0.6" />
        {/* Gentle hill curve */}
        <path d="M 0,550 Q 500,450 1200,520 L 1200,700 L 0,700 Z" fill="#24201E" />
        <path d="M 0,580 Q 600,480 1200,560 L 1200,700 L 0,700 Z" fill="#1C1917" />
        {/* Solitary thinker figure silhouette on hill */}
        <g transform="translate(480, 410) scale(1.4)">
          <circle cx="30" cy="30" r="10" fill="#EDE8E0" />
          <path d="M 28,40 Q 15,65 10,95 Q 40,97 50,95 Q 42,65 34,40 Z" fill="#EDE8E0" />
          {/* Notebook in hand */}
          <rect x="25" y="60" width="16" height="12" rx="1" fill="#9C6B3C" />
        </g>
      </svg>
    )
  };

  const illustrationSvg = illustrations[name] || illustrations['solitude-window'];

  return (
    <div className={`overflow-hidden bg-[#FDFCF9] ${aspect} ${className}`}>
      {illustrationSvg}
    </div>
  );
};

export default NotionIllustration;
