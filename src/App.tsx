import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import './App.css'
import { content } from './content'

type IconName = 'arrow' | 'back' | 'play' | 'pause' | 'close' | 'music' | 'spark' | 'lock' | 'heart' | 'chevron'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  if (name === 'arrow') return <svg {...common}><path d="M5 12h13M13 6l6 6-6 6" /></svg>
  if (name === 'back') return <svg {...common}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
  if (name === 'play') return <svg {...common}><path d="m8 5 11 7-11 7V5Z" fill="currentColor" stroke="none" /></svg>
  if (name === 'pause') return <svg {...common}><path d="M8 5v14M16 5v14" strokeWidth="2.2" /></svg>
  if (name === 'close') return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>
  if (name === 'music') return <svg {...common}><path d="M9 18V5l10-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3Zm10-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3Z" /></svg>
  if (name === 'spark') return <svg {...common}><path d="m12 3 1.2 6.8L20 12l-6.8 1.2L12 20l-1.2-6.8L4 12l6.8-2.2L12 3Z" /><path d="m19 3 .4 2.1L21 6l-1.6.4L19 8l-.4-1.6L17 6l1.6-.9L19 3Z" /></svg>
  if (name === 'lock') return <svg {...common}><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></svg>
  if (name === 'heart') return <svg {...common}><path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" /></svg>
  return <svg {...common}><path d="m9 18 6-6-6-6" /></svg>
}

function Button({ children, onClick, variant = 'solid', icon, type = 'button' }: { children: ReactNode; onClick?: () => void; variant?: 'solid' | 'outline' | 'text'; icon?: IconName; type?: 'button' | 'submit' }) {
  return <button type={type} className={`button button--${variant}`} onClick={onClick}>{children}{icon && <Icon name={icon} size={16} />}</button>
}

function Counter({ value, duration = 900 }: { value: string; duration?: number }) {
  const numeric = Number(value)
  const [shown, setShown] = useState(numeric)
  useEffect(() => {
    if (!Number.isFinite(numeric)) return
    let frame = 0
    const started = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - started) / duration, 1)
      setShown(Math.round(numeric * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [duration, numeric])
  return <>{Number.isFinite(numeric) ? shown.toLocaleString() : value}</>
}

function ImagePlaceholder({ src, alt, className = '' }: { src?: string; alt: string; className?: string }) {
  return <div className={`image-placeholder ${className}`} style={src ? { backgroundImage: `url(${src})` } : undefined} role="img" aria-label={alt}>{!src && <span>add a photograph</span>}</div>
}

function Confetti() {
  const colors = ['#d9bd91', '#c98798', '#fff8f0', '#f4dde1', '#641e36']
  return <div className="confetti" aria-hidden="true">{Array.from({ length: 56 }, (_, index) => <i key={index} style={{ left: `${(index * 37) % 101}%`, backgroundColor: colors[index % colors.length], animationDelay: `${(index % 12) * 0.12}s`, width: `${5 + (index % 4)}px`, height: `${9 + (index % 7)}px` }} />)}</div>
}

function LoveBubbles() {
  const hearts = ['♥', '♡', '❤', '♥︎']
  return <div className="love-bubbles" aria-hidden="true">{Array.from({ length: 28 }, (_, index) => <span key={index} style={{ left: `${(index * 41) % 103}%`, animationDelay: `${(index % 10) * 0.28}s`, animationDuration: `${5.5 + (index % 5) * 0.7}s` }}>{hearts[index % hearts.length]}</span>)}</div>
}

function LetterModal({ letter, onClose }: { letter: typeof content.letters[number]; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
  return <div className="letter-modal" role="dialog" aria-modal="true" aria-label={letter.title} onClick={(event) => { if (event.target === event.currentTarget) onClose() }}><button className="letter-modal__close" onClick={onClose} aria-label="Close letter"><Icon name="close" /></button><div className="letter-paper"><div className="letter-paper__topline"><span className="section-marker">a letter for you</span><span>no. {String(content.letters.indexOf(letter) + 1).padStart(2, '0')}</span></div><h2>{letter.title}</h2><div className="letter-body">{letter.body.split('\n\n').map((paragraph, index) => <p key={`${letter.title}-${index}`}>{paragraph}</p>)}</div><span className="signature">{content.yourName}<small>always</small></span></div></div>
}

function Wrapped({ autoStart }: { autoStart: boolean }) {
  const [slide, setSlide] = useState(0)
  const [direction, setDirection] = useState<'next' | 'previous'>('next')
  const [revealed, setRevealed] = useState<number | null>(null)
  const [selectedLetter, setSelectedLetter] = useState<typeof content.letters[number] | null>(null)
  const [finaleVideoDone, setFinaleVideoDone] = useState(false)
  const touchStart = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const total = 9
  const next = () => { setDirection('next'); setFinaleVideoDone(false); setSlide((current) => Math.min(current + 1, total - 1)) }
  const previous = () => { setDirection('previous'); setFinaleVideoDone(false); setSlide((current) => Math.max(current - 1, 0)) }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') next()
      if (event.key === 'ArrowLeft') previous()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  useEffect(() => {
    if (!autoStart || selectedLetter || slide === total - 1) return
    const timer = window.setTimeout(() => next(), slide === 0 ? 7000 : 6500)
    return () => window.clearTimeout(timer)
  }, [autoStart, selectedLetter, slide])

  return <section className="wrapped" id="wrapped" aria-label="Our year in review">
    <div className="wrapped__progress" aria-label={`Slide ${slide + 1} of ${total}`}>{Array.from({ length: total }, (_, index) => <span key={index} className={index <= slide ? 'is-active' : ''} />)}</div>
    <div className={`slide slide--${slide + 1} slide--move-${direction}`} onTouchStart={(event) => { touchStart.current = event.changedTouches[0].clientX; touchStartY.current = event.changedTouches[0].clientY }} onTouchEnd={(event) => { if (touchStart.current === null || touchStartY.current === null) return; const deltaX = event.changedTouches[0].clientX - touchStart.current; const deltaY = event.changedTouches[0].clientY - touchStartY.current; if (Math.abs(deltaY) > 48 && Math.abs(deltaY) > Math.abs(deltaX)) { if (deltaY < 0) next(); else previous() } else if (Math.abs(deltaX) > 48) { if (deltaX < 0) next(); else previous() } touchStart.current = null; touchStartY.current = null }}>
      <div className="slide__grain" />
      {slide === 0 && <video className="intro-video" autoPlay muted loop playsInline preload="metadata" src={content.media.introVideo} aria-hidden="true" />}
      {slide === 0 && <div className="slide-content intro-slide"><div className="eyebrow"><span className="eyebrow__line" /> an anniversary archive <span className="eyebrow__line" /></div><div className="intro-slide__orbit"><span>365</span><i>days of us</i></div><h1>One year.<br /><em>A thousand memories.</em><br />One person I’d choose<br />all over again.</h1><p className="intro-slide__note">A small collection of the moments, the in-betweens,<br className="desktop-only" /> and all the reasons you are my favourite.</p><Button onClick={next} variant="solid" icon="arrow">Start our story</Button><div className="gesture-guide"><span>⌃</span><strong>swipe up to begin</strong><small>or tap the button above</small></div><div className="scroll-cue"><span /> swipe left or right to explore</div></div>}
      {slide === 1 && <div className="slide-content numbers-slide"><div className="section-marker">01 / our year, by the numbers</div><h2>Turns out, love<br /><em>has its own kind of math.</em></h2><div className="number-grid">{content.stats.map((stat) => <div className="number-item" key={stat.label}><strong><Counter value={stat.value} /></strong><span>{stat.label}</span><small>{stat.note}</small></div>)}</div><p className="edit-note">{content.editNote}</p></div>}
      {slide === 2 && <div className="slide-content highlights-slide"><div className="section-marker">02 / the highlights</div><div className="highlights-heading"><h2>The moments that<br /><em>still feel like magic.</em></h2><p>Some memories arrive loudly.<br />The best ones tend to linger.</p></div><div className="highlight-collage">{content.highlights.map((memory, index) => <article className={`highlight-card highlight-card--${index + 1}`} key={memory.title}><ImagePlaceholder src={memory.image} alt={memory.title} /><div className="highlight-card__caption"><span>{memory.date}</span><h3>{memory.title}</h3><p>{memory.description}</p></div></article>)}</div></div>}
      {slide === 3 && <div className="slide-content favorite-slide"><div className="section-marker">03 / my favourite person</div><div className="favorite-layout"><ImagePlaceholder src={content.favorite.image} alt="Favourite person" className="favorite-photo" /><div className="favorite-copy"><span className="quote-mark">“</span><h2>{content.favorite.headline}</h2><p>{content.favorite.message}</p><div className="signature">{content.yourName}<span>with all my heart</span></div></div></div></div>}
      {slide === 4 && <div className="slide-content little-slide"><div className="section-marker">04 / the little things</div><h2>It’s the little things.<br /><em>Always has been.</em></h2><p className="little-intro">Tap a card. I’ll tell you why it matters.</p><div className="little-grid">{content.littleThings.map((thing, index) => <button key={thing.title} className={`little-card ${revealed === index ? 'is-revealed' : ''}`} onClick={() => setRevealed(revealed === index ? null : index)}><span className="little-card__number">0{index + 1}</span><span className="little-card__title">{revealed === index ? thing.message : thing.title}</span><Icon name={revealed === index ? 'close' : 'spark'} size={17} /></button>)}</div></div>}
      {slide === 5 && <div className="slide-content soundtrack-slide"><div className="section-marker">05 / our soundtrack</div><div className="soundtrack-heading"><div><h2>Some songs are<br /><em>just us in disguise.</em></h2><p>Press play on the memory behind each one.</p></div><div className="record"><div className="record__label">OUR<br />LOVE</div><div className="record__hole" /></div></div><div className="song-list">{content.songs.map((song) => <a className="song-row" href={song.link || '#'} target={song.link ? '_blank' : undefined} rel="noreferrer" key={song.title}><ImagePlaceholder src={song.image} alt={song.title} /><span className="song-row__info"><strong>{song.title}</strong><small>{song.artist}</small></span><span className="song-row__why">{song.why}</span><Icon name="arrow" size={18} /></a>)}</div></div>}
      {slide === 6 && <div className="slide-content letters-slide"><div className="section-marker">06 / words I want you to keep</div><h2>Some things are<br /><em>too important to say once.</em></h2><p className="letters-slide__intro">Because sometimes, even a thousand kisses cannot say everything my heart wants you to know.</p><div className="letter-strip">{content.letters.map((letter, index) => <button key={letter.title} className={`letter-pill letter-pill--${index + 1}`} onClick={() => setSelectedLetter(letter)}><span>0{index + 1}</span><strong>{letter.title}</strong><small>{letter.openWhen}</small><Icon name="arrow" size={16} /></button>)}</div></div>}
      {slide === 7 && <div className="slide-content reveal-slide"><div className="reveal-slide__small">the only statistic that matters</div><h2>{content.revealMessage}</h2><div className="reveal-line" /><button className="reveal-answer" onClick={(event) => event.currentTarget.classList.toggle('is-shown')}><span>I would still choose you.<br /><em>Every single time.</em></span><Icon name="heart" size={30} /></button><p>365 days down. A lifetime of memories to go.</p></div>}
      {slide === 8 && <div className="slide-content final-slide"><Confetti />{finaleVideoDone && <LoveBubbles />}<div className="final-slide__content"><span className="section-marker">the final frame</span><h2>Happy first anniversary,<br /><em>my love.</em></h2><p>{content.nextChapter.message}</p><div className={`final-visual ${finaleVideoDone ? 'is-done' : ''}`}>{finaleVideoDone ? <ImagePlaceholder src={content.media.finalImage} alt="Our favourite anniversary memory" className="final-photo final-image" /> : <video className="final-photo final-video" autoPlay muted playsInline preload="metadata" onEnded={() => setFinaleVideoDone(true)} src={content.media.ambientVideo} aria-label="A favourite memory from our first year" />}</div><div className="final-slide__signature">{content.yourName}<span>still my favourite person · still my favourite story</span></div><button className="final-replay" onClick={() => { setDirection('previous'); setFinaleVideoDone(false); setSlide(0) }}><Icon name="back" size={16} /> replay our year</button></div></div>}
    </div>
    <div className="slide-nav"><button onClick={previous} disabled={slide === 0} aria-label="Previous slide"><Icon name="back" /></button><span>{String(slide + 1).padStart(2, '0')} <i>/</i> {String(total).padStart(2, '0')}</span><button onClick={next} disabled={slide === total - 1} aria-label="Next slide"><Icon name="arrow" /></button></div>
    {selectedLetter && <LetterModal letter={selectedLetter} onClose={() => setSelectedLetter(null)} />}
  </section>
}

function App() {
  const [started, setStarted] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [replayKey, setReplayKey] = useState(0)
  const youtubeRef = useRef<HTMLIFrameElement | null>(null)
  const sendYoutubeCommand = useCallback((command: 'playVideo' | 'pauseVideo') => { youtubeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: command, args: [] }), '*') }, [])
  useEffect(() => {
    if (!started) return
    const timer = window.setTimeout(() => sendYoutubeCommand('playVideo'), 900)
    return () => window.clearTimeout(timer)
  }, [sendYoutubeCommand, started])
  const beginExperience = () => { setStarted(true); setAudioPlaying(true) }
  const toggleAudio = () => { sendYoutubeCommand(audioPlaying ? 'pauseVideo' : 'playVideo'); setAudioPlaying((playing) => !playing) }
  const replay = () => { setReplayKey((key) => key + 1); document.querySelector('#wrapped')?.scrollIntoView({ behavior: 'smooth' }) }
  return <main><header className="site-header"><a className="site-logo" href="#wrapped">OUR <span>LOVE</span></a><span className="site-header__occasion">first anniversary / wrapped edition</span><span className="site-header__link">365 days of us</span></header><div className={`loader ${started ? 'is-done' : ''}`}><span>OUR LOVE</span><small>an anniversary archive</small></div><div className="app-shell"><Wrapped key={replayKey} autoStart={started} /></div>{started && <iframe ref={youtubeRef} className="youtube-audio" title="Bad Dancer by Johnny Drille" src={`https://www.youtube.com/embed/${content.soundtrack.youtubeId}?autoplay=1&loop=1&playlist=${content.soundtrack.youtubeId}&controls=0&playsinline=1&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`} allow="autoplay; encrypted-media" /> }<div className="soundtrack-control"><Icon name="music" size={16} /><span>{content.soundtrack.title} · {content.soundtrack.artist}</span><button onClick={toggleAudio} aria-label={audioPlaying ? 'Pause soundtrack' : 'Play soundtrack'}><Icon name={audioPlaying ? 'pause' : 'play'} size={13} /></button><a href={content.soundtrack.link} target="_blank" rel="noreferrer">open</a></div><button className="replay" onClick={replay}><Icon name="back" size={15} /> replay our year</button><button className="start-overlay" onClick={beginExperience} aria-label="Begin experience"><span>Begin · swipe up to start</span></button></main>
}

export default App
