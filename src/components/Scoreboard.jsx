// Tableau d'affichage — le score se révèle façon palette à volets
export default function Scoreboard({ scoreA, scoreB, labelA = 'A', labelB = 'B' }) {
  const has = scoreA != null && scoreB != null
  return (
    <div className="inline-flex items-stretch rounded-xl overflow-hidden bg-grass-deep border border-chalk/10 shadow-soft">
      <Side label={labelA} accent />
      <Digit value={has ? scoreA : '–'} />
      <div className="flex items-center px-1 bg-grass-deep text-chalk/40 font-display text-lg">:</div>
      <Digit value={has ? scoreB : '–'} />
      <Side label={labelB} />
    </div>
  )
}

function Side({ label, accent }) {
  return (
    <div
      className={
        'flex items-center px-2.5 text-[10px] font-bold uppercase tracking-widest ' +
        (accent ? 'text-floodlight' : 'text-chalk/60')
      }
    >
      {label}
    </div>
  )
}

function Digit({ value }) {
  return (
    <div className="flex items-center justify-center min-w-[38px] px-2 py-2 bg-black/40 border-x border-black/40">
      <span
        key={value}
        className="font-display text-3xl text-chalk leading-none animate-flap num"
      >
        {value}
      </span>
    </div>
  )
}
