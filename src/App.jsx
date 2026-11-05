
import { useEffect, useRef, useState } from 'react'
import './App.css'

const verbs = [
  'Go', 'Eat', 'See', 'Play', 'Write', 'Buy',
  'Run', 'Drink', 'Make', 'Come', 'Take', 'Give',
  'Speak', 'Swim', 'Have', 'Find', 'Get', 'Sleep',
  'Read', 'Sing', 'Drive', 'Break', 'Choose',
  'Fly', 'Know', 'Teach', 'Think', 'Catch',
  'Bring', 'Begin'
]

const answers = [
  'went', 'ate', 'saw', 'played', 'wrote', 'bought',
  'ran', 'drank', 'made', 'came', 'took', 'gave',
  'spoke', 'swam', 'had', 'found', 'got', 'slept',
  'read', 'sang', 'drove', 'broke', 'chose',
  'flew', 'knew', 'taught', 'thought', 'caught',
  'brought', 'began'
]

const STEP_TIME = 550
const ROLL_TIME = 1500

const connections = [
  { type: 'ladder', from: 5, to: 12 },
  { type: 'ladder', from: 7, to: 18 },
  { type: 'ladder', from: 14, to: 25 },
  {
    type: 'snake',
    from: 11,
    to: 2,
    file: '/snake1.png',
    x: 107,
    y: 305,
    width: 114,
    height: 163,
    angle: -20
  },
  {
    type: 'snake',
    from: 22,
    to: 9,
    file: '/snake2.png',
    x: 237,
    y: 155,
    width: 131,
    height: 199,
    angle: 25
  },
  {
    type: 'snake',
    from: 29,
    to: 19,
    file: '/snake3.png',
    x: 425,
    y: 35,
    width: 134,
    height: 175,
    angle: -25
  }
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

// BOARD ART: SNAKES AND IMPROVED WOODEN LADDERS

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
          const start = centerOf(from)
          const end = centerOf(to)

          const a = {
            x: start.x + 25,
            y: start.y + 15
          }

          const b = {
            x: end.x + 25,
            y: end.y - 15
          }

          const dx = b.x - a.x
          const dy = b.y - a.y
          const len = Math.hypot(dx, dy)
          const px = -dy / len
          const py = dx / len

          const railWidth = 8
          const stepCount = Math.max(
            3,
            Math.floor(len / 25)
          )

          return (
            <g key={from}>
              {/* Dark wooden outlines */}
              {[-railWidth, railWidth].map(offset => (
                <line
                  key={`outline-${offset}`}
                  x1={a.x + px * offset}
                  y1={a.y + py * offset}
                  x2={b.x + px * offset}
                  y2={b.y + py * offset}
                  stroke="#80502b"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              ))}

              {/* Light wooden rails */}
              {[-railWidth, railWidth].map(offset => (
                <line
                  key={`rail-${offset}`}
                  x1={a.x + px * offset}
                  y1={a.y + py * offset}
                  x2={b.x + px * offset}
                  y2={b.y + py * offset}
                  stroke="#c78b47"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              ))}

              {/* Wooden rungs */}
              {Array.from(
                { length: stepCount },
                (_, i) => {
                  const t = (i + 1) / (stepCount + 1)

                  return (
                    <line
                      key={`step-${i}`}
                      x1={
                        a.x +
                        dx * t +
                        px * railWidth
                      }
                      y1={
                        a.y +
                        dy * t +
                        py * railWidth
                      }
                      x2={
                        a.x +
                        dx * t -
                        px * railWidth
                      }
                      y2={
                        a.y +
                        dy * t -
                        py * railWidth
                      }
                      stroke="#f4c47c"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                  )
                }
              )}
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
            transform={`rotate(${c.angle} ${
              c.x + c.width / 2
            } ${c.y + c.height / 2})`}
          />
        ))}
    </svg>
  )
}

// 3D DICE


function Dice3D({ value, rolling }) {
  const rotations = {
    1: 'rotateX(0deg) rotateY(0deg)',
    2: 'rotateX(-90deg) rotateY(0deg)',
    3: 'rotateX(0deg) rotateY(-90deg)',
    4: 'rotateX(0deg) rotateY(90deg)',
    5: 'rotateX(90deg) rotateY(0deg)',
    6: 'rotateX(0deg) rotateY(180deg)'
  }

  const faces = [
    { number: 1, side: 'front', dots: [4] },
    { number: 6, side: 'back', dots: [0, 2, 3, 5, 6, 8] },
    { number: 3, side: 'right', dots: [0, 4, 8] },
    { number: 4, side: 'left', dots: [0, 2, 6, 8] },
    { number: 2, side: 'top', dots: [0, 8] },
    { number: 5, side: 'bottom', dots: [0, 2, 4, 6, 8] }
  ]

  return (
    <div className="real-dice-stage">
      <div
        className={`real-dice ${
          rolling ? 'real-dice-rolling' : ''
        }`}
        style={{
          '--dice-final-rotation': rotations[value]
        }}
        role="img"
        aria-label={`Dice showing ${value}`}
      >
        {faces.map(face => (
          <div
            key={face.number}
            className={`real-dice-face dice-${face.side}`}
          >
            <div className="dice-pips">
              {Array.from({ length: 9 }, (_, index) => (
                <span
                  key={index}
                  className={
                    face.dots.includes(index)
                      ? 'dice-pip'
                      : 'dice-pip empty'
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


// ANIMATED ANSWER CELEBRATION

function AnswerCelebration({ question, onClose }) {
  const confettiColors = [
    '#ffd700',
    '#ff6b6b',
    '#4ade80',
    '#60a5fa',
    '#c084fc'
  ]

  return (
    <div
      className="celebration-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Teacher answer reveal"
    >
      <div className="celebration-card">
        <div
          className="confetti-container"
          aria-hidden="true"
        >
          {Array.from({ length: 35 }, (_, i) => (
            <span
              key={i}
              className="confetti-piece"
              style={{
                left: `${(i * 37) % 100}%`,
                animationDelay: `${(i % 10) * -0.22}s`,
                animationDuration: `${
                  2 + (i % 5) * 0.25
                }s`,
                backgroundColor:
                  confettiColors[
                    i % confettiColors.length
                  ]
              }}
            />
          ))}
        </div>

        <div className="celebration-star star-one">
          ⭐
        </div>

        <div className="celebration-star star-two">
          ✨
        </div>

        <div className="celebration-star star-three">
          🌟
        </div>

        <div className="celebration-star star-four">
          ⭐
        </div>

        <div className="celebration-heading">
          🎉 ANSWER REVEAL! 🎉
        </div>

        <div className="celebration-subtitle">
          🌿 JUNGLE WORD CHALLENGE 🌿
        </div>

        <div className="celebration-original">
          {verbs[question - 1]}
        </div>

        <div className="celebration-arrow">
          ⬇
        </div>

        <div className="celebration-answer-box">
          <div className="celebration-answer-label">
            ✨ THE CORRECT ANSWER ✨
          </div>

          <div className="celebration-answer">
            {answers[question - 1]}
          </div>
        </div>

        <div className="celebration-footer">
          ⭐ GREAT LEARNING! ⭐
        </div>

        <button
          className="celebration-close"
          onClick={onClose}
        >
          ✓ BACK TO THE GAME
        </button>
      </div>
    </div>
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
  const [answerPopup, setAnswerPopup] = useState(false)
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
    setAnswerPopup(false)
    setWinner(null)
    setMessage('Team 1, roll the dice to begin!')
  }

  function rollDice() {
    if (busy) return

    const current = teams[turn].position
    const result = Math.floor(Math.random() * 6) + 1
    const destination = Math.min(
      30,
      current + result
    )

    setDice(result)
    setRolling(true)
    setMessage(
      `${teams[turn].name} is rolling...`
    )

    schedule(() => {
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
            schedule(() => {
              setMoving(false)
              setQuestion(square)
              setAnswerPopup(false)
              setMessage(
                `${teams[turn].name}, say the past tense of "${verbs[square - 1]}"!`
              )
            }, STEP_TIME)
          }
        }, (square - current) * STEP_TIME)
      }
    }, ROLL_TIME)
  }

  function finishTurn(correct) {
    if (
      question === null ||
      moving ||
      answerPopup
    ) {
      return
    }

    const square = question
    const special = connectionAt[square]

    let destination = square

    let feedback = correct
      ? 'Great answer!'
      : `The answer is "${answers[square - 1]}".`

    if (special) {
      destination = special.to

      feedback += special.type === 'snake'
        ? ` 🐍 Slide to ${destination}!`
        : ` 🪜 Climb to ${destination}!`
    }

    setQuestion(null)
    setAnswerPopup(false)

    if (special) {
      setMoving(true)
    }

    setTeams(prev =>
      prev.map((team, i) =>
        i === turn
          ? {
              ...team,
              position: destination
            }
          : team
      )
    )

    function completeTurn() {
      if (destination === 30) {
        setWinner(turn)
        setMessage(
          `🏆 ${teams[turn].name} wins!`
        )
        setMoving(false)
        return
      }

      const next = (turn + 1) % teams.length

      setTurn(next)
      setMessage(
        `${feedback} ${teams[next].name}, you're up!`
      )
      setMoving(false)
    }

    if (special) {
      schedule(completeTurn, 900)
    } else {
      completeTurn()
    }
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

          <section
            className="games-section"
            id="games"
          >
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
                <div className="game-icon">
                  🐍🪜
                </div>

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
                <div className="game-icon">
                  🏝️
                </div>

                <h3>Treasure Island</h3>

                <p>
                  A new adventure is coming soon.
                </p>

                <span className="coming-soon">
                  Coming soon
                </span>
              </article>

              <article className="game-card">
                <div className="game-icon">
                  🏁
                </div>

                <h3>English Race</h3>

                <p>
                  Race your classmates to the finish line.
                </p>

                <span className="coming-soon">
                  Coming soon
                </span>
              </article>

              <article className="game-card">
                <div className="game-icon">
                  💬
                </div>

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
            <div className="custom-icon">
              ✨
            </div>

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
            <h2>
              Something for every classroom
            </h2>

            <div className="membership-grid">
              <div>
                <h3>🌟 Free</h3>

                <p>
                  Play ready-made games and, when custom
                  games launch, create one per month.
                </p>
              </div>

              <div>
                <h3>
                  👑 Premium — coming later
                </h3>

                <p>
                  More custom games, editing and
                  saved activities.
                </p>
              </div>
            </div>
          </section>

          <footer>
            <strong>
              🎲 English Game Hub
            </strong>

            <p>
              Made for playful English learning.
            </p>
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
              onClick={() => {
                setAnswerPopup(false)
                setPage('home')
              }}
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
                <span>
                  🌟 RACE TO 30!
                </span>

                <span>
                  🏆 FINISH LINE
                </span>
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
                    </div>
                  ))}
                </div>

                <BoardArt />

                <div className="explorer-layer">
                  {teams.map((team, i) => {
                    const pos =
                      team.position === 0
                        ? { x: 50, y: 550 }
                        : centerOf(team.position)

                    return (
                      <div
                        key={i}
                        className={`explorer explorer-${i}`}
                        style={{
                          left: `${pos.x / 6}%`,
                          top: `${pos.y / 5}%`
                        }}
                        title={team.name}
                      >
                        <span className="explorer-character">
                          🧑‍🚀
                        </span>
                      </div>
                    )
                  })}
                </div>
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
                  {teams[turn].emoji}{' '}
                  {teams[turn].name}
                </div>

                <div className="team-list">
                  {teams.map((team, i) => (
                    <div
                      className={`team-pill ${
                        i === turn
                          ? 'selected'
                          : ''
                      }`}
                      key={i}
                    >
                      <span>
                        {team.emoji} {team.name}
                      </span>

                      <b>
                        {team.position}/30
                      </b>
                    </div>
                  ))}
                </div>
              </section>

              <section className="dice-panel">
                <span className="panel-eyebrow">
                  🎲 TIME TO ROLL!
                </span>

                <Dice3D
                  value={dice}
                  rolling={rolling}
                />

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

              <section className="question-panel">
                <span className="panel-eyebrow">
                  ✨ ENGLISH CHALLENGE
                </span>

                {question !== null ? (
                  <>
                    <p>
                      What is the past simple of...
                    </p>

                    <div className="challenge-word">
                      {verbs[question - 1]}
                    </div>

                    <button
                      className="reveal-button"
                      onClick={() =>
                        setAnswerPopup(true)
                      }
                    >
                      ✨ REVEAL THE ANSWER! ✨
                    </button>

                    <div className="answer-buttons">
                      <button
                        className="correct-button"
                        onClick={() =>
                          finishTurn(true)
                        }
                      >
                        ✓ CORRECT
                      </button>

                      <button
                        className="incorrect-button"
                        onClick={() =>
                          finishTurn(false)
                        }
                      >
                        ✕ INCORRECT
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="challenge-placeholder">
                    {winner !== null
                      ? '🏆 Game finished!'
                      : moving
                      ? '🚶 Explorer is moving...'
                      : '🎲 Roll the dice to get a question!'}
                  </div>
                )}
              </section>

              {winner !== null && (
                <section className="winner-panel">
                  🏆

                  <h2>
                    {teams[winner].name} wins!
                  </h2>

                  <p>
                    Fantastic teamwork!
                  </p>
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

          {answerPopup && question !== null && (
            <AnswerCelebration
              question={question}
              onClose={() =>
                setAnswerPopup(false)
              }
            />
          )}
        </main>
      )}
    </div>
  )
}
