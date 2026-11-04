
import { useEffect, useRef, useState } from 'react'
import './App.css'

const verbs = ['Go','Eat','See','Play','Write','Buy','Run','Drink','Make','Come','Take','Give','Speak','Swim','Have','Find','Get','Sleep','Read','Sing','Drive','Break','Choose','Fly','Know','Teach','Think','Catch','Bring','Begin']
const answers = ['went','ate','saw','played','wrote','bought','ran','drank','made','came','took','gave','spoke','swam','had','found','got','slept','read','sang','drove','broke','chose','flew','knew','taught','thought','caught','brought','began']

// One source of truth for the rules AND the graphics.
const connections = [
  { type: 'ladder', from: 5, to: 12 },
  { type: 'ladder', from: 7, to: 18 },
  { type: 'ladder', from: 14, to: 25 },
  { type: 'snake', from: 11, to: 2, file: '/snake1.png', x: 107, y: 305, width: 114, height: 163, angle: -20 },
  { type: 'snake', from: 22, to: 9, file: '/snake2.png', x: 237, y: 155, width: 131, height: 199, angle: 25 },
  { type: 'snake', from: 29, to: 19, file: '/snake3.png', x: 425, y: 35, width: 134, height: 175, angle: -25 },
]

const connectionAt = Object.fromEntries(
  connections.map(item => [item.from, item])
)

const boardRows = Array.from({ length: 5 }, (_, index) => {
  const row = 4 - index
  const numbers = Array.from(
    { length: 6 },
    (_, col) => row * 6 + col + 1
  )
  return row % 2 === 0 ? numbers : numbers.reverse()
})

function centerOf(number) {
  const row = Math.floor((number - 1) / 6)
  const place = (number - 1) % 6
  const column = row % 2 === 0 ? place : 5 - place

  return {
    x: column * 100 + 50,
    y: 450 - row * 100
  }
}

function BoardArt() {
  return (
    <svg
      className="board-connections"
      viewBox="0 0 600 500"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {connections
        .filter(c => c.type === 'ladder')
        .map(({ from, to }) => {
          const a = centerOf(from)
          const b = centerOf(to)

          const dx = b.x - a.x
          const dy = b.y - a.y
          const len = Math.hypot(dx, dy)
          const px = -dy / len
          const py = dx / len

          return (
            <g key={from}>
              {[-10, 10].map(offset => (
                <line
                  key={offset}
                  x1={a.x + px * offset}
                  y1={a.y + py * offset}
                  x2={b.x + px * offset}
                  y2={b.y + py * offset}
                  stroke="#89502b"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
              ))}

              {[.12, .27, .42, .57, .72, .87].map(t => (
                <line
                  key={t}
                  x1={a.x + dx * t + px * 10}
                  y1={a.y + dy * t + py * 10}
                  x2={a.x + dx * t - px * 10}
                  y2={a.y + dy * t - py * 10}
                  stroke="#f7c376"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              ))}
            </g>
          )
        })}

      {connections
        .filter(c => c.type === 'snake')
        .map(c => (
          <image
            key={c.from}
            href={c.file}
            x={c.x}
            y={c.y}
            width={c.width}
            height={c.height}
            preserveAspectRatio="xMidYMid meet"
            transform={`rotate(${c.angle} ${c.x + c.width / 2} ${c.y + c.height / 2})`}
          />
        ))}
    </svg>
  )
}

export default function App() {
  const [page, setPage] = useState('home')

  const [teams, setTeams] = useState([
    { name: 'Team 1', emoji: '🔴', position: 0 },
    { name: 'Team 2', emoji: '🔵', position: 0 }
  ])

  const [turn, setTurn] = useState(0)
  const [dice, setDice] = useState(1)
  const [rolling, setRolling] = useState(false)
  const [moving, setMoving] = useState(false)
  const [question, setQuestion] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [message, setMessage] = useState(
    'Team 1, roll the dice to begin!'
  )
  const [winner, setWinner] = useState(null)

  const timers = useRef([])

  const busy =
    rolling ||
    moving ||
    question !== null ||
    winner !== null

  function schedule(fn, ms) {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
  }

  function cancelTimers() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout)
    }
  }, [])

  function resetGame() {
    cancelTimers()

    setTeams([
      { name: 'Team 1', emoji: '🔴', position: 0 },
      { name: 'Team 2', emoji: '🔵', position: 0 }
    ])

    setTurn(0)
    setDice(1)
    setRolling(false)
    setMoving(false)
    setQuestion(null)
    setShowAnswer(false)
    setWinner(null)
    setMessage('Team 1, roll the dice to begin!')
  }

  function rollDice() {
    if (busy) return

    const current = teams[turn].position
    const result = Math.floor(Math.random() * 6) + 1
    const destination = Math.min(30, current + result)

    setRolling(true)
    setMessage(`${teams[turn].name} is rolling...`)

    schedule(() => {
      setDice(result)
      setRolling(false)
      setMoving(true)

      for (
        let square = current + 1;
        square <= destination;
        square++
      ) {
        schedule(() => {
          setTeams(prev =>
            prev.map((team, i) =>
              i === turn
                ? { ...team, position: square }
                : team
            )
          )

          if (square === destination) {
            setMoving(false)
            setQuestion(square)
            setShowAnswer(false)

            setMessage(
              `${teams[turn].name}, say the past tense of “${verbs[square - 1]}”!`
            )
          }
        }, (square - current) * 250)
      }
    }, 650)
  }

  function finishTurn(correct) {
    if (question === null) return

    const square = question
    const special = connectionAt[square]

    let destination = square
    let feedback = correct
      ? 'Great answer!'
      : `The answer is “${answers[square - 1]}”.`

    // Landing on a snake slides down;
    // landing on a ladder climbs up.
    if (special) {
      destination = special.to

      feedback += special.type === 'snake'
        ? ` 🐍 Slide to ${destination}!`
        : ` 🪜 Climb to ${destination}!`
    }

    setQuestion(null)
    setShowAnswer(false)

    setTeams(prev =>
      prev.map((team, i) =>
        i === turn
          ? { ...team, position: destination }
          : team
      )
    )

    if (destination === 30) {
      setWinner(turn)
      setMessage(`🏆 ${teams[turn].name} wins!`)
      return
    }

    const next = (turn + 1) % teams.length

    setTurn(next)
    setMessage(
      `${feedback} ${teams[next].name}, you're up!`
    )
  }

  return (
    <div className="app">
      {page === 'home' ? (
        <>
          <nav className="navbar">
            <div className="logo">
              🎲 English Game Hub
            </div>

            <div className="nav-links">
              <a href="#games">Games</a>
              <a href="#membership">Membership</a>

              <button
                className="signup-button"
                onClick={() => setPage('game')}
              >
                Play now
              </button>
            </div>
          </nav>

          <section className="hero">
            <div className="hero-content">
              <span className="welcome-tag">
                PLAY • LEARN • LAUGH
              </span>

              <h1>
                Learning English is{' '}
                <span>an adventure!</span>
              </h1>

              <p>
                Big, colourful classroom games that make
                practising English feel like playtime.
              </p>

              <button
                className="main-button"
                onClick={() => setPage('game')}
              >
                🐍 Play Snakes & Ladders
              </button>
            </div>

            <div className="hero-art">
              <span>🐍</span>
              <span>🎲</span>
              <span>🪜</span>
              <strong>Ready to play?</strong>
            </div>
          </section>

          <section className="games-section" id="games">
            <div className="section-heading">
              <div>
                <span className="small-heading">
                  CHOOSE AN ADVENTURE
                </span>
                <h2>Classroom Games</h2>
              </div>

              <span className="free-label">
                FREE TO PLAY
              </span>
            </div>

            <div className="game-grid">
              <article className="game-card">
                <div className="game-icon">🐍🪜</div>
                <span className="game-category">
                  GRAMMAR & VOCABULARY
                </span>
                <h3>Snakes & Ladders</h3>
                <p>
                  Roll, race and practise irregular
                  past-tense verbs.
                </p>
                <button
                  className="play-button"
                  onClick={() => setPage('game')}
                >
                  Play now →
                </button>
              </article>

              <article className="game-card">
                <div className="game-icon">🏝️</div>
                <h3>Treasure Island</h3>
                <p>A new adventure is coming soon.</p>
                <span className="coming-soon">
                  Coming soon
                </span>
              </article>

              <article className="game-card">
                <div className="game-icon">🏁</div>
                <h3>English Race</h3>
                <p>
                  Race your classmates to the finish line.
                </p>
                <span className="coming-soon">
                  Coming soon
                </span>
              </article>

              <article className="game-card">
                <div className="game-icon">💬</div>
                <h3>Word Challenge</h3>
                <p>
                  Build vocabulary with quick-fire questions.
                </p>
                <span className="coming-soon">
                  Coming soon
                </span>
              </article>
            </div>
          </section>

          <section className="custom-section">
            <div className="custom-icon">✨</div>
            <div>
              <h2>Make the game your own!</h2>
              <p>
                Custom classroom games are on the way.
                Choose your topic and challenge your students.
              </p>
            </div>
          </section>

          <section
            className="membership-section"
            id="membership"
          >
            <h2>Something for every classroom</h2>

            <div className="membership-grid">
              <div>
                <h3>🌟 Free</h3>
                <p>
                  Play ready-made games and, when custom
                  games launch, create one per month.
                </p>
              </div>

              <div>
                <h3>👑 Premium — coming later</h3>
                <p>
                  More custom games, editing and
                  saved activities.
                </p>
              </div>
            </div>
          </section>

          <footer>
            <strong>🎲 English Game Hub</strong>
            <p>Made for playful English learning.</p>
          </footer>
        </>
      ) : (
        <main className="game-page">
          <div className="jungle-leaf leaf-left">
            🌿
          </div>

          <div className="jungle-leaf leaf-right">
            🌴
          </div>

          <div className="game-top">
            <button
              className="back-button"
              onClick={() => setPage('home')}
            >
              ← Back to Games
            </button>

            <div className="game-title">
              <div className="game-kicker">
                THE CLASSROOM ADVENTURE
              </div>

              <h1>
                🐍 Snakes & Ladders 🪜
              </h1>

              <p>
                Roll the dice • Move your team •
                Say the past tense!
              </p>
            </div>
          </div>

          <div className="game-layout">
            <section className="board-shell">
              <div className="board-banner">
                <span>🌟 RACE TO 30!</span>
                <span>🏆 FINISH LINE</span>
              </div>

              <div className="board">
                <div className="board-grid">
                  {boardRows.flat().map(number => (
                    <div
                      className={`square shade-${number % 4} ${
                        number === 30
                          ? 'finish-square'
                          : ''
                      }`}
                      key={number}
                    >
                      <span className="square-number">
                        {number}
                      </span>

                      <strong>
                        {verbs[number - 1]}
                      </strong>

                      {number === 30 && (
                        <span className="finish">
                          🏆
                        </span>
                      )}

                      <div className="pieces">
                        {teams.map((team, i) =>
                          team.position === number ? (
                            <span
                              key={i}
                              title={team.name}
                            >
                              {team.emoji}
                            </span>
                          ) : null
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <BoardArt />
              </div>

              <div className="board-footer">
                🐍 Slide down the snakes
                <span> • </span>
                🪜 Climb up the ladders
              </div>
            </section>

            <aside className="game-controls">
              <section className="turn-panel">
                <span className="panel-eyebrow">
                  ⭐ WHO'S PLAYING?
                </span>

                <h2>Current Turn</h2>

                <div className="active-team">
                  {teams[turn].emoji} {teams[turn].name}
                </div>

                <div className="team-list">
                  {teams.map((team, i) => (
                    <div
                      className={`team-pill ${
                        i === turn ? 'selected' : ''
                      }`}
                      key={i}
                    >
                      <span>
                        {team.emoji} {team.name}
                      </span>

                      <b>{team.position}/30</b>
                    </div>
                  ))}
                </div>
              </section>

              <section className="dice-panel">
                <span className="panel-eyebrow">
                  🎲 TIME TO ROLL!
                </span>

                <div
                  className={`big-dice ${
                    rolling ? 'dice-rolling' : ''
                  }`}
                >
                  {
                    ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][
                      dice - 1
                    ]
                  }
                </div>

                <button
                  className="roll-button"
                  onClick={rollDice}
                  disabled={busy}
                >
                  {rolling
                    ? 'Rolling...'
                    : moving
                    ? 'Moving...'
                    : question !== null
                    ? 'Answer first!'
                    : winner !== null
                    ? 'Game finished'
                    : '🎲 ROLL DICE'}
                </button>
              </section>

              <section className="message-panel">
                💬 {message}
              </section>

              {question !== null && (
                <section className="question-panel">
                  <span className="panel-eyebrow">
                    ✨ ENGLISH CHALLENGE
                  </span>

                  <p>
                    What is the past simple of...
                  </p>

                  <div className="challenge-word">
                    {verbs[question - 1]}
                  </div>

                  <button
                    className="reveal-button"
                    onClick={() =>
                      setShowAnswer(v => !v)
                    }
                  >
                    {showAnswer
                      ? 'Hide answer'
                      : '👀 Show teacher answer'}
                  </button>

                  {showAnswer && (
                    <div className="answer-reveal">
                      {answers[question - 1]}
                    </div>
                  )}

                  <div className="answer-buttons">
                    <button
                      className="correct-button"
                      onClick={() => finishTurn(true)}
                    >
                      ✓ CORRECT
                    </button>

                    <button
                      className="incorrect-button"
                      onClick={() => finishTurn(false)}
                    >
                      ✕ INCORRECT
                    </button>
                  </div>
                </section>
              )}

              {winner !== null && (
                <section className="winner-panel">
                  🏆
                  <h2>
                    {teams[winner].name} wins!
                  </h2>
                  <p>Fantastic teamwork!</p>
                </section>
              )}

              <button
                className="reset-button"
                onClick={resetGame}
              >
                ↻ Restart Game
              </button>
            </aside>
          </div>
        </main>
      )}
    </div>
  )
}
