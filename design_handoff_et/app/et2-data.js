// et2-data.js — ET connected app: curriculum, quizzes, sim configs.
// Module 01 · Your First Deal — 5 lessons, each ending in a simulator.

window.ET2DATA = (function () {

  const MODULE = {
    id: 'm01',
    eyebrow: 'Module 01',
    title: 'Your First Deal',
    sub: 'From spotting an opportunity to owning the block.',
  };

  const LESSONS = [
    {
      id: 'spot', n: 1, title: 'Spot the Opportunity', mins: '12 min', icon: 'house',
      tagline: 'What separates a deal from a listing.',
      learn: ['Why price ≠ value', 'The 1% rule as a 10-second filter', 'Reading a motivated seller'],
      cards: [
        { eyebrow: 'Chapter 1 · 3', title: 'Price is what you pay.', quote: 'Value is what you walk away with.',
          body: 'A deal is a property selling below what it\u2019s worth to YOU. That gap can come from condition, a motivated seller, or rent the market hasn\u2019t priced in. Your job is finding the gap \u2014 not finding a pretty house.' },
        { eyebrow: 'Chapter 2 · 3', title: 'The 1% rule.',
          body: 'A 10-second filter: monthly rent should be at least 1% of the purchase price. A $180k duplex renting for $2,000/mo passes (1.1%). A $400k condo renting $2,400 (0.6%) doesn\u2019t. It\u2019s not the whole answer \u2014 it tells you what deserves a closer look.' },
        { eyebrow: 'Chapter 3 · 3', title: 'Motivated sellers leave fingerprints.',
          body: '90+ days on market. Price cuts. \u201cAs-is.\u201d Inherited or out-of-state owners. Vacant units. Each one is a signal the seller values speed and certainty over top dollar \u2014 which is exactly what you\u2019re selling as a buyer.' },
      ],
      quiz: [
        { q: 'A $200k duplex rents for $2,300/mo total. By the 1% rule, it\u2026',
          opts: [{ id: 'a', label: 'Fails — rent is under 2% of price' }, { id: 'b', label: 'Passes — rent is over 1% of price' }, { id: 'c', label: 'Needs an appraisal to tell' }],
          correct: 'b', why: '$2,300 ÷ $200,000 = 1.15%. It clears the 1% bar — worth a closer look.' },
        { q: 'Which is the strongest motivated-seller signal?',
          opts: [{ id: 'a', label: 'Fresh listing, staged photos' }, { id: 'b', label: 'Vacant, 120 days on market, two price cuts' }, { id: 'c', label: 'Open house this weekend' }],
          correct: 'b', why: 'Vacancy costs the seller money every month, and 120 days + cuts means the market already said no twice.' },
      ],
      sim: { id: 'spotter', name: 'Deal Spotter', status: 'live',
        brief: 'Five listings hit the market at once. You have 60 seconds and one offer. Swipe past the pretty traps and find the real deal.' },
    },
    {
      id: 'buybox', n: 2, title: 'Build Your Buy Box', mins: '14 min', icon: 'coins',
      tagline: 'Criteria first. Shopping second.',
      learn: ['Defining market, type, price band', 'Why discipline beats taste', 'Saying no fast'],
      cards: [
        { eyebrow: 'Chapter 1 · 2', title: 'A buy box is a contract with yourself.',
          body: 'Market: Memphis. Type: 2\u20134 units. Price: $150\u2013250k. Condition: cosmetic rehab only. Min rent-to-price: 1%. Write it down before you shop. Every pro investor you\u2019ve heard of can recite theirs from memory.' },
        { eyebrow: 'Chapter 2 · 2', title: 'The box says no for you.',
          body: 'Deals die when emotion negotiates. When a gorgeous house misses your numbers, the box already answered \u2014 you never have to be the one who says no. Discipline is a system, not a personality trait.' },
      ],
      quiz: [
        { q: 'A stunning $310k single-family pops up. Your box says 2–4 units, $150–250k. You\u2026',
          opts: [{ id: 'a', label: 'Stretch — it\u2019s a great house' }, { id: 'b', label: 'Pass in 10 seconds and keep shopping' }, { id: 'c', label: 'Lowball at $250k' }],
          correct: 'b', why: 'The box exists so you don\u2019t renegotiate with yourself per-house. Outside the box = automatic pass.' },
        { q: 'What belongs in a buy box?',
          opts: [{ id: 'a', label: 'Market, property type, price band, condition, min rent ratio' }, { id: 'b', label: 'Paint colors and finishes' }, { id: 'c', label: 'Whatever feels right that day' }],
          correct: 'a', why: 'A buy box is the measurable stuff. Finishes are a rehab decision, not a buying criterion.' },
      ],
      sim: { id: 'buyboxsim', name: 'Buy Box', status: 'live',
        brief: 'Set your criteria, then a feed of listings floods in. Sort keepers from junk fast enough to beat the other buyers.' },
    },
    {
      id: 'underwrite', n: 3, title: 'Underwriting 101', mins: '18 min', icon: 'bank',
      tagline: 'Think like the bank that says no.',
      learn: ['NOI and what counts as an expense', 'DSCR — the lender\u2019s one number', 'Cash-on-cash return'],
      cards: [
        { eyebrow: 'Chapter 1 · 3', title: 'NOI: the property\u2019s real paycheck.',
          body: 'Net Operating Income = rents minus operating expenses (taxes, insurance, maintenance, management, vacancy) \u2014 before the loan. If a deal only works with zero vacancy and no repairs, it doesn\u2019t work.' },
        { eyebrow: 'Chapter 2 · 3', title: 'DSCR: the bank\u2019s one number.',
          body: 'Debt Service Coverage Ratio = NOI ÷ annual loan payments. At 1.0 the property exactly pays its own mortgage. Lenders usually want 1.2+ \u2014 a 20% cushion. Below that, the answer is no, regardless of your highlight reel.' },
        { eyebrow: 'Chapter 3 · 3', title: 'Cash-on-cash: YOUR number.',
          body: 'Annual cash flow after the loan, divided by the cash you actually put in. It\u2019s the honest answer to \u201cwhat does my money earn here?\u201d \u2014 and the number to compare against every other place that money could go.' },
      ],
      quiz: [
        { q: 'NOI is $24k/yr. Loan payments are $20k/yr. DSCR?',
          opts: [{ id: 'a', label: '0.83' }, { id: 'b', label: '1.2' }, { id: 'c', label: '4.0' }],
          correct: 'b', why: '$24,000 ÷ $20,000 = 1.2 — right at the line most lenders want.' },
        { q: 'Which is NOT part of NOI?',
          opts: [{ id: 'a', label: 'Property taxes' }, { id: 'b', label: 'Vacancy allowance' }, { id: 'c', label: 'Your mortgage payment' }],
          correct: 'c', why: 'NOI is before debt. That\u2019s the point — it measures the property, not your financing.' },
      ],
      sim: { id: 'underwriter', name: 'Underwrite It', status: 'live',
        brief: 'You\u2019re the lender now. Loan files hit your desk — run the numbers and approve or deny before the clock runs out.' },
    },
    {
      id: 'flip', n: 4, title: 'The Flip', mins: '16 min', icon: 'apartments',
      tagline: 'Buy it right, fix what sells, get out fast.',
      learn: ['ARV — after-repair value', 'The 70% rule', 'Scope that sells vs. over-improvement', 'Why speed is profit'],
      cards: [
        { eyebrow: 'Chapter 1 · 4', title: 'ARV: the finish line.', quote: 'You make your money when you buy.',
          body: 'After-Repair Value is what the property sells for once the work is done \u2014 set by comparable SOLD homes nearby, not by your renovation receipts. Every flip decision runs backward from this number.' },
        { eyebrow: 'Chapter 2 · 4', title: 'The 70% rule.',
          body: 'Max purchase price = 70% of ARV minus rehab costs. ARV $300k, rehab $40k \u2192 pay no more than $170k. The missing 30% isn\u2019t profit — it\u2019s where closing costs, holding costs, selling fees AND your profit all have to live.' },
        { eyebrow: 'Chapter 3 · 4', title: 'Fix what sells. Skip what doesn\u2019t.',
          body: 'Kitchens, baths, paint, flooring, curb appeal \u2014 buyers pay for those. Pools, smart-home gadgets, luxury upgrades in a starter neighborhood \u2014 they rarely return their cost. Never renovate past what the street supports.' },
        { eyebrow: 'Chapter 4 · 4', title: 'The meter is always running.',
          body: 'Every week you hold: loan interest, taxes, insurance, utilities. Call it $650/week on a typical flip. A two-month delay isn\u2019t \u201ca little behind\u201d \u2014 it\u2019s $5k+ straight out of your profit. Speed is a line item.' },
      ],
      quiz: [
        { q: 'ARV is $300k, rehab is $40k. By the 70% rule, your max offer is\u2026',
          opts: [{ id: 'a', label: '$210,000' }, { id: 'b', label: '$170,000' }, { id: 'c', label: '$260,000' }],
          correct: 'b', why: '70% × $300k = $210k, minus $40k rehab = $170k max purchase.' },
        { q: 'Which upgrade most often FAILS to return its cost on a flip?',
          opts: [{ id: 'a', label: 'A pool' }, { id: 'b', label: 'Interior paint' }, { id: 'c', label: 'A kitchen refresh' }],
          correct: 'a', why: 'Pools are expensive, slow, and most buyers won\u2019t pay extra for them. Paint and kitchens are the classic ROI plays.' },
        { q: 'Holding costs are\u2026',
          opts: [{ id: 'a', label: 'A one-time fee at closing' }, { id: 'b', label: 'Weekly bleed: interest, taxes, utilities while you own it' }, { id: 'c', label: 'Only a problem for rentals' }],
          correct: 'b', why: 'The meter runs every week you own the property. Time is a cost — that\u2019s why speed matters.' },
      ],
      sim: { id: 'flipit', name: 'Flip It', status: 'live',
        brief: 'You just closed on a tired duplex. Pick your rehab scope, protect the budget, beat the clock — then see what the market pays you.' },
    },
    {
      id: 'block', n: 5, title: 'Own the Block', mins: '22 min', icon: 'villa',
      tagline: 'Capstone: compete for a whole neighborhood.',
      learn: ['Portfolio thinking', 'When to walk away', 'Competing without overpaying'],
      cards: [
        { eyebrow: 'Capstone', title: 'One deal is luck. A block is a system.',
          body: 'The capstone puts everything together: spotting, buy-box discipline, underwriting and rehab math \u2014 against rival buyers chasing the same five properties.' },
      ],
      quiz: [
        { q: 'A rival bids 15% over your max number. You\u2026',
          opts: [{ id: 'a', label: 'Beat their bid — winning matters' }, { id: 'b', label: 'Let it go. Your number is your number' }, { id: 'c', label: 'Match it and cut the rehab budget' }],
          correct: 'b', why: 'Overpaying turns a win into a loss. The discipline IS the strategy.' },
      ],
      sim: { id: 'blockroyale', name: 'Block Royale', status: 'live',
        brief: 'Five properties. Three rival buyers. Limited capital. Outbid, out-negotiate and out-position them to control the block.' },
    },
  ];

  // ── Flip It simulator config ───────────────────────────────────
  const FLIP = {
    propertyName: '1942 Faxon Ave · Memphis',
    propertyDesc: '2BR/1BA duplex · built 1958 · tired but solid',
    purchase: 196000,
    asIs: 205000,          // resale value with zero work
    budget: 42000,
    baseWeeks: 2,          // closing-to-listing overhead
    holdPerWeek: 650,
    sellPct: 0.06,
    targetProfit: 18000,
    items: [
      { id: 'roof',    label: 'Roof repair',          cost: 7500,  weeks: 1.5, add: 12000, essential: true,  penalty: 15000,
        note: 'Inspector flagged missing shingles. Buyers\u2019 lenders care about roofs.' },
      { id: 'kitchen', label: 'Kitchen refresh',      cost: 9000,  weeks: 2,   add: 19000,
        note: 'Cabinets painted, new counters + hardware. Not a gut job.' },
      { id: 'luxkit',  label: 'Luxury kitchen gut',   cost: 24000, weeks: 4,   add: 26000, excludes: 'kitchen',
        note: 'Quartz waterfall island, panel-ready appliances.' },
      { id: 'bath',    label: 'Bathroom update',      cost: 6500,  weeks: 1.5, add: 13000,
        note: 'New vanity, tile surround, fixtures.' },
      { id: 'paint',   label: 'Paint, inside & out',  cost: 4200,  weeks: 1,   add: 9000,
        note: 'The classic. Whole place, neutral palette.' },
      { id: 'floor',   label: 'LVP flooring',         cost: 5800,  weeks: 1,   add: 11500,
        note: 'Replace worn carpet throughout both units.' },
      { id: 'hvac',    label: 'HVAC replacement',     cost: 6800,  weeks: 1,   add: 9000,  essential: true,  penalty: 8000,
        note: 'Both condensers are 22 years old and wheezing.' },
      { id: 'curb',    label: 'Landscaping & curb',   cost: 2400,  weeks: 0.5, add: 5500,
        note: 'Sod, mulch, house numbers, porch light.' },
      { id: 'smart',   label: 'Smart-home package',   cost: 3500,  weeks: 0.5, add: 2500,
        note: 'Video doorbell, smart locks, learning thermostat.' },
      { id: 'pool',    label: 'Install a pool',       cost: 35000, weeks: 5,   add: 16000,
        note: 'An above-market wow factor. The contractor loves this idea.' },
      { id: 'stage',   label: 'Staging & photos',     cost: 2200,  weeks: 0.5, add: 5000,
        note: 'Furniture, twilight shots, drone photos.' },
    ],
    grades: [
      { min: 28000, g: 'S', line: 'Surgeon. You fixed exactly what sells and nothing else.', xp: 200 },
      { min: 18000, g: 'A', line: 'Pro-grade flip. The 70% rule would be proud.', xp: 150 },
      { min: 8000,  g: 'B', line: 'Profitable — but some of that budget didn\u2019t earn its keep.', xp: 100 },
      { min: 0,     g: 'C', line: 'You survived. Review which line items actually moved the price.', xp: 50 },
      { min: -Infinity, g: 'F', line: 'You lost money. Cheaper than losing it on a real house.', xp: 25 },
    ],
  };

  const QUIZ_XP = 25; // per correct answer

  return { MODULE, LESSONS, FLIP, QUIZ_XP };
})();
