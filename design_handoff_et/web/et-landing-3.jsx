// et-landing-3.jsx — "the players" section. Real athletes, their live deals.
// Re-skinned to the ET blue system (the source mock is red); product integrity
// kept: same surfaces, Inter Tight / JetBrains Mono, glossy chips, green status.
// Headshots + property photos are <image-slot> drop targets (persist on reload).

const HEX = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

const PLAYERS = [
  { id: 'fred', name: 'Fred Brown', pos: 'Wide Receiver', loc: 'Jackson, MS',
    college: 'MISS ST', collegeTint: '#7a1f2b',
    deals: 1, prop: { tag: 'Multi-Family', name: 'The Fifth & Fondren', sqft: '11,530 sqft', city: 'Jackson, MS' } },
  { id: 'bobby', name: 'Bobby Evans Jr', pos: 'Offensive Tackle', loc: 'Dallas, TX',
    college: 'OKLAHOMA', collegeTint: '#7a1f2b',
    deals: 1, prop: { tag: 'Duplex', name: '2400 Buchanan St', sqft: '3,440 sqft', city: 'Nashville, TN' } },
  { id: 'fales', name: 'David Fales', pos: 'Quarterback', loc: 'Phoenix, AZ',
    college: 'SJSU', collegeTint: '#1f4a8a',
    deals: 2, prop: { tag: 'Duplex', name: '2109 14th Ave N', sqft: '3,536 sqft', city: 'Nashville, TN' } },
  { id: 'nate', name: 'Nate Gilliam', pos: 'Guard', loc: 'Nashville, TN',
    college: 'WAKE FOREST', collegeTint: '#1f4a8a',
    deals: 2, prop: { tag: 'Single Family', name: '1715 Heiman St', sqft: '1,500 sqft', city: 'Nashville, TN' } },
  { id: 'austin', name: 'Austin Bryant', pos: 'Defensive End', loc: 'Brentwood, TN',
    college: 'CLEMSON', collegeTint: '#7a1f2b',
    deals: 1, prop: { tag: 'Single Family', name: '1008 Highland Brentwood', sqft: '4,500 sqft', city: 'Brentwood, TN' } },
];

function Pin({ size = 14, color = L.muted }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z" stroke={color} strokeWidth="1.8" />
    <circle cx="12" cy="10" r="2.4" stroke={color} strokeWidth="1.8" /></svg>;
}

function PlayerCard({ p }) {
  const sqft = String(p.prop.sqft).replace(/\s*sqft/i, '');
  const typeShort = p.prop.tag === 'Multi-Family' ? 'Multi' : p.prop.tag === 'Single Family' ? 'Single' : p.prop.tag;
  const stats = [
    { v: String(p.deals), k: 'active deals' },
    { v: sqft, k: 'sq ft' },
    { v: typeShort, k: 'asset' },
  ];
  return (
    <div style={{ position: 'relative', background: 'rgba(20,23,30,0.45)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)',
      border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, overflow: 'hidden',
      boxShadow: '0 18px 44px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)', transition: 'transform .2s, border-color .2s' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(30,91,255,0.7)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>

      {/* cover banner — real liquid glass (fills with the live-deal photo when dropped) */}
      <div style={{ position: 'relative', height: 150,
        boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.55), inset 1.5px 0 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.25)' }}>
        <image-slot id={`pl-${p.id}-prop`} shape="rect" placeholder="Property photo"
          style={{ display: 'block', width: '100%', height: '100%',
            backdropFilter: 'blur(18px) saturate(170%)', WebkitBackdropFilter: 'blur(18px) saturate(170%)',
            background: 'linear-gradient(140deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.07) 36%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.13) 100%)' }}></image-slot>
        {/* diagonal specular streak */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(118deg, transparent 28%, rgba(255,255,255,0.22) 45%, rgba(255,255,255,0.05) 52%, transparent 64%)' }} />
        {/* soft bottom shade to ground the avatar */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 68%, rgba(8,10,14,0.34))', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 14, right: 14, display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '6px 12px', borderRadius: 999, background: 'rgba(8,10,13,0.7)', backdropFilter: 'blur(6px)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: L.green, boxShadow: `0 0 8px ${L.green}` }} />
          <span style={{ fontFamily: LM, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', color: '#fff' }}>LIVE</span>
        </div>
        {/* circular avatar overlapping bottom-left */}
        <div style={{ position: 'absolute', left: 20, bottom: -30, width: 68, height: 68, borderRadius: '50%',
          border: `4px solid ${L.surface}`, background: L.surface2, overflow: 'hidden', boxShadow: `0 6px 18px rgba(0,0,0,0.5)` }}>
          <image-slot id={`pl-${p.id}-face`} shape="circle" placeholder={p.name.split(' ').map((w) => w[0]).join('')}
            style={{ display: 'block', width: '100%', height: '100%', background: '#11131a' }}></image-slot>
        </div>
      </div>

      {/* body — everything aligned to one left edge */}
      <div style={{ padding: '42px 20px 20px' }}>
        {/* title block, left-aligned */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: LM, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: L.blueLite, marginBottom: 7 }}>ELITE MOGUL</div>
            <div style={{ fontFamily: LF, fontSize: 22, fontWeight: 800, letterSpacing: '-0.025em', color: L.ink, lineHeight: 1.05 }}>{p.name}</div>
            <div style={{ fontFamily: LF, fontSize: 14, color: L.muted, marginTop: 5 }}>{p.pos} · {p.loc}</div>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, flexShrink: 0, paddingTop: 24 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: L.green }} />
            <span style={{ fontFamily: LF, fontSize: 13.5, color: L.muted }}>Active</span>
          </div>
        </div>

        {/* property name line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 18 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M4 20V9l8-5 8 5v11" stroke={L.blueLite} strokeWidth="1.8" strokeLinejoin="round" /><rect x="9.5" y="13" width="5" height="7" stroke={L.blueLite} strokeWidth="1.8" /></svg>
          <span style={{ fontFamily: LF, fontSize: 15, fontWeight: 700, color: L.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.prop.name}</span>
        </div>

        {/* stat strip — 3 columns with dividers */}
        <div style={{ display: 'flex', marginTop: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '14px 0' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', borderLeft: i ? `1px solid ${L.line}` : 'none' }}>
              <div style={{ fontFamily: LF, fontSize: 17, fontWeight: 800, letterSpacing: '-0.01em', color: L.ink }}>{s.v}</div>
              <div style={{ fontFamily: LF, fontSize: 12, color: L.muted, marginTop: 4 }}>{s.k}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Blank "join" card — sixth slot, in the locker-room ethos.
function JoinCard() {
  return (
    <a href="#waitlist" style={{ textDecoration: 'none', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      minHeight: 360, padding: '40px 28px', borderRadius: 24, cursor: 'pointer', overflow: 'hidden',
      background: 'linear-gradient(158deg, rgba(58,110,255,0.22) 0%, rgba(30,91,255,0.13) 60%, rgba(30,91,255,0.18) 100%)',
      backdropFilter: 'blur(22px) saturate(150%)', WebkitBackdropFilter: 'blur(22px) saturate(150%)',
      border: '1px solid rgba(120,160,255,0.45)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22), 0 18px 44px rgba(20,50,160,0.32)', transition: 'transform .2s, border-color .2s, background .2s' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(150,185,255,0.8)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(120,160,255,0.45)'; }}>
      <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(30,91,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 30, position: 'relative' }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.6" stroke={L.blueLite} strokeWidth="1.8" /><path d="M5 19.5c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" stroke={L.blueLite} strokeWidth="1.8" strokeLinecap="round" /></svg>
        <span style={{ position: 'absolute', right: -3, bottom: -3, width: 26, height: 26, borderRadius: '50%', background: L.blue, border: `2.5px solid ${L.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></svg>
        </span>
      </div>
      <div style={{ fontFamily: LM, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: L.blueLite, marginBottom: 16 }}>OPEN ROSTER SPOT</div>
      <div style={{ fontFamily: LF, fontSize: 23, fontWeight: 800, letterSpacing: '-0.025em', color: L.ink, lineHeight: 1.08, maxWidth: 260 }}>This locker is empty.</div>
      <p style={{ fontFamily: LF, fontSize: 15, lineHeight: 1.5, color: L.muted, margin: '16px 0 32px', maxWidth: 260 }}>
        Claim your spot, track your first deal, and put your name on the board.
      </p>
      <span style={{ appearance: 'none', borderRadius: 999, padding: '14px 26px', background: L.blue, color: '#fff', fontFamily: LF, fontWeight: 700, fontSize: 15.5, letterSpacing: '-0.01em',
        display: 'inline-flex', alignItems: 'center', gap: 9, boxShadow: `0 10px 28px ${L.blue}44` }}>
        Claim Your Spot
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h13M12 6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </a>
  );
}

function PlayersSection() {
  return (
    <Section id="players" bg={L.bg} style={{ padding: '110px 0' }}>
      <Backdrop glow={0.5} pos="top-left" />
      <Wrap>
        <SecHead center eyebrow="The locker room"
          title="Real players. Real portfolios."
          sub="From the league to the ledger: see the athletes already turning game checks into owned assets. Every deal live, every move tracked." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }} className="players-grid">
          {PLAYERS.map((p) => <PlayerCard key={p.id} p={p} />)}
          <JoinCard />
        </div>
        <div style={{ textAlign: 'center', marginTop: 44 }}>
          <div style={{ fontFamily: LF, fontSize: 17, color: L.muted }}>
            <span style={{ color: L.ink, fontWeight: 700 }}>240+ athletes</span> building right now. Your name goes here next.
          </div>
        </div>
      </Wrap>
    </Section>
  );
}

Object.assign(window, { PLAYERS, PlayerCard, JoinCard, PlayersSection, ExperienceBand });

// ── experience / community band ────────────────────────────────
function ExperienceBand() {
  const items = [
    { icon: 'trophy', t: 'A status, not a subscription' },
    { icon: 'apartments', t: 'Deals you can follow' },
    { icon: 'coins', t: 'A network that compounds' },
  ];
  return (
    <Section id="experience" bg={L.bg} style={{ padding: '110px 0', overflow: 'hidden' }}>
      <Backdrop glow={0.4} pos="bottom-right" />
      <Wrap className="split-grid">
        <div>
          <Eye style={{ marginBottom: 16, display: 'block' }}>The experience</Eye>
          <h2 style={{ fontFamily: LF, fontSize: 'clamp(32px, 4vw, 50px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.04, color: L.ink, margin: '0 0 18px', textWrap: 'balance' }}>
            More than an app.<br /><span style={{ fontFamily: LS, fontStyle: 'italic', fontWeight: 400, color: L.blue }}>A locker room for owners.</span>
          </h2>
          <p style={{ fontFamily: LF, fontSize: 18, lineHeight: 1.55, color: L.muted, margin: 0, maxWidth: 460 }}>
            We’re not selling a course. We’re building the room where athletes become owners, and your standing in it is something you earn.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 30 }}>
            {items.map((it, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(30,91,255,0.14)', border: '1px solid rgba(30,91,255,0.3)' }}>
                  <ET2Puffy type={it.icon} hue="blue" size={22} />
                </span>
                <div style={{ fontFamily: LF, fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', color: L.ink }}>{it.t}</div>
              </div>
            ))}
          </div>
        </div>
        <AnimatedFeed items={EXP_FEED} glow={L.blue} dur={24} />
      </Wrap>
    </Section>
  );
}

Object.assign(window, { ExperienceBand });
