
import { useEffect, useRef, useState } from 'react'
import './App.css'

// ==========================================
// ENGLISH GAME HUB — FOUR COMPLETE GAMES
// ==========================================

const gameTopics = {
  pastTense: {
    title: 'Past Tense',
    subtitle: 'Say the past tense!',
    question: 'What is the past simple of...',
    instruction: 'Say the past tense of',
    words: [
      'Go', 'Eat', 'See', 'Play', 'Write', 'Buy',
      'Run', 'Drink', 'Make', 'Come', 'Take', 'Give',
      'Speak', 'Swim', 'Have', 'Find', 'Get', 'Sleep',
      'Read', 'Sing', 'Drive', 'Break', 'Choose',
      'Fly', 'Know', 'Teach', 'Think', 'Catch',
      'Bring', 'Begin'
    ],
    answers: [
      'went', 'ate', 'saw', 'played', 'wrote', 'bought',
      'ran', 'drank', 'made', 'came', 'took', 'gave',
      'spoke', 'swam', 'had', 'found', 'got', 'slept',
      'read', 'sang', 'drove', 'broke', 'chose',
      'flew', 'knew', 'taught', 'thought', 'caught',
      'brought', 'began'
    ]
  },

  opposites: {
    title: 'Opposite Adjectives',
    subtitle: 'Say the opposite adjective!',
    question: 'What is the opposite of...',
    instruction: 'Say the opposite of',
    words: [
      'Big', 'Hot', 'Happy', 'Tall', 'Fast', 'Clean',
      'Rich', 'Easy', 'Young', 'Strong', 'Loud',
      'Heavy', 'Full', 'Wet', 'Hard', 'Brave',
      'Beautiful', 'Wide', 'Deep', 'Thick',
      'Bright', 'Polite', 'Kind', 'Safe', 'Early',
      'Expensive', 'Healthy', 'Careful',
      'Interesting', 'Generous'
    ],
    answers: [
      'small', 'cold', 'sad', 'short', 'slow', 'dirty',
      'poor', 'difficult', 'old', 'weak', 'quiet',
      'light', 'empty', 'dry', 'soft', 'cowardly',
      'ugly', 'narrow', 'shallow', 'thin',
      'dark', 'rude', 'cruel', 'dangerous', 'late',
      'cheap', 'unhealthy', 'careless',
      'boring', 'selfish'
    ]
  },

  gerundsInfinitives: {
    title: 'Gerunds & Infinitives',
    subtitle: 'Complete the sentence!',
    question: 'Complete the sentence:',
    instruction: 'Complete the sentence',
    words: [
      'Want', 'Enjoy', 'Decide', 'Finish', 'Hope',
      'Avoid', 'Promise', 'Keep', 'Need', 'Suggest',
      'Agree', 'Miss', 'Plan', 'Practise', 'Refuse',
      'Dislike', 'Offer', 'Consider', 'Expect', 'Admit',
      'Choose', 'Discuss', 'Manage', 'Imagine',
      'Learn', 'Recommend', 'Wish', 'Mind',
      'Prepare', 'Risk'
    ],
    sentences: [
      'I want ______ (play) football.',
      'She enjoys ______ (dance).',
      'He decided ______ (leave) early.',
      'They finished ______ (eat) dinner.',
      'We hope ______ (win) the game.',
      'I avoid ______ (run) in the rain.',
      'She promised ______ (help) me.',
      'He keeps ______ (talk) in class.',
      'I need ______ (study) tonight.',
      'They suggested ______ (walk) home.',
      'She agreed ______ (come) with us.',
      'I miss ______ (play) with my friends.',
      'He plans ______ (travel) to Japan.',
      'We practised ______ (sing) the song.',
      'She refused ______ (answer) the question.',
      'He dislikes ______ (cook).',
      'I offered ______ (carry) the bag.',
      'They considered ______ (move) house.',
      'I expect ______ (pass) the test.',
      'She admitted ______ (lie) to her teacher.',
      'We chose ______ (stay) at home.',
      'They discussed ______ (go) to the beach.',
      'He managed ______ (finish) his homework.',
      'Can you imagine ______ (fly) in space?',
      'I learned ______ (swim) last year.',
      'She recommended ______ (visit) the museum.',
      'I wish ______ (see) you again.',
      'Would you mind ______ (open) the window?',
      'They prepared ______ (leave) early.',
      'He risks ______ (lose) his money.'
    ],
    answers: [
      'to play', 'dancing', 'to leave', 'eating',
      'to win', 'running', 'to help', 'talking',
      'to study', 'walking', 'to come', 'playing',
      'to travel', 'singing', 'to answer', 'cooking',
      'to carry', 'moving', 'to pass', 'lying',
      'to stay', 'going', 'to finish', 'flying',
      'to swim', 'visiting', 'to see', 'opening',
      'to leave', 'losing'
    ]
  },

  feelings: {
    title: 'Feelings & Emotions',
    subtitle: 'Guess the emotion!',
    question: 'How would you feel?',
    instruction: 'Guess the emotion',
    words: [
      '😊', '😢', '😡', '🤩', '😬', '😨',
      '😎', '😳', '😲', '😐', '😟', '😕',
      '😴', '🥺', '😒', '😌', '😞', '🥰',
      '😤', '🌈', '😱', '🤔', '😔', '😁',
      '😊', '😣', '🕊️', '🙄', '🤯', '😮‍💨'
    ],
    sentences: [
      'You receive a lovely present from your friend.',
      'Your best friend moves to another country.',
      'Someone deliberately breaks your favourite toy.',
      'You are going to Disneyland tomorrow!',
      'You are about to give a speech in front of the whole school.',
      'You hear a frightening noise outside your bedroom at night.',
      'You win first prize in a school competition after working very hard.',
      'You fall over in front of your classmates and everyone sees you.',
      'Your friends organise a secret birthday party for you.',
      'You have nothing interesting to do all afternoon.',
      'Your dog is missing and you do not know where it is.',
      'Your teacher explains something, but you do not understand it.',
      'You stayed awake all night and can hardly keep your eyes open.',
      'Nobody wants to play with you and you are sitting alone.',
      'Your friend gets an expensive present that you really wanted.',
      'You are resting on a comfortable chair beside the sea.',
      'Your favourite football team loses the final match.',
      'Someone helps you when you are having a difficult time.',
      'You keep trying to solve a problem, but nothing works.',
      'Things are difficult today, but you believe tomorrow will be better.',
      'You hear some completely unexpected and unbelievable news.',
      'You discover a mysterious locked box and want to know what is inside.',
      'You told a lie and now you feel bad about what you did.',
      'You have studied hard and know you are ready for your English test.',
      'You meet lots of new people and feel uncomfortable speaking.',
      'You have been waiting for your food for a very long time.',
      'You are sitting beside a quiet river, listening to the birds.',
      'Someone keeps interrupting you while you are speaking.',
      'You watch a magician perform an incredible trick.',
      'You find your phone after thinking you had lost it forever.'
    ],
    answers: [
      'happy', 'sad', 'angry', 'excited', 'nervous',
      'scared', 'proud', 'embarrassed', 'surprised',
      'bored', 'worried', 'confused', 'tired',
      'lonely', 'jealous', 'relaxed', 'disappointed',
      'grateful', 'frustrated', 'hopeful', 'shocked',
      'curious', 'guilty', 'confident', 'shy',
      'impatient', 'peaceful', 'annoyed',
      'amazed', 'relieved'
    ]
  }
}

// ==========================================
// GAME SETTINGS
// ==========================================

const STEP_TIME = 550
const ROLL_TIME = 1500
const SPECIAL_TIME = 1800
const TRAP_SQUARE = 24

const initialTeams = () => [
  { name: 'Team 1', emoji: '🔴', position: 0 },
  { name: 'Team 2', emoji: '🔵', position: 0 }
]

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
  },
  { type: 'trap', from: TRAP_SQUARE, to: 0 }
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
  if (number === 0) {
    return { x: 50, y: 550 }
  }

  const row = Math.floor((number - 1) / 6)
  const place = (number - 1) % 6
  const column = row % 2 === 0 ? place : 5 - place

  return {
    x: column * 100 + 50,
    y: 450 - row * 100
  }
}

// ==========================================
// BOARD ART
// ==========================================

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
          const stepCount = Math.max(3, Math.floor(len / 25))

          return (
            <g key={from}>
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

              {Array.from(
                { length: stepCount },
                (_, i) => {
                  const t = (i + 1) / (stepCount + 1)

                  return (
                    <line
                      key={`step-${i}`}
                      x1={a.x + dx * t + px * railWidth}
                      y1={a.y + dy * t + py * railWidth}
                      x2={a.x + dx * t - px * railWidth}
                      y2={a.y + dy * t - py * railWidth}
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

// ==========================================
// 3D DICE
// ==========================================

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

// ==========================================
// ANSWER CELEBRATION
// ==========================================

function AnswerCelebration({ question, topic, onClose }) {
  const colors = [
    '#ffd700',
    '#ff6b6b',
    '#4ade80',
    '#60a5fa',
    '#c084fc'
  ]

  const prompt = topic.sentences
    ? topic.sentences[question - 1]
    : topic.words[question - 1]

  return (
    <div
      className="celebration-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Answer reveal"
    >
      <div className="celebration-card">
        <div className="confetti-container" aria-hidden="true">
          {Array.from({ length: 35 }, (_, i) => (
            <span
              key={i}
              className="confetti-piece"
              style={{
                left: `${(i * 37) % 100}%`,
                animationDelay: `${(i % 10) * -0.22}s`,
                animationDuration: `${2 + (i % 5) * 0.25}s`,
                backgroundColor: colors[i % colors.length]
              }}
            />
          ))}
        </div>

        <div className="celebration-star star-one">⭐</div>
        <div className="celebration-star star-two">✨</div>
        <div className="celebration-star star-three">🌟</div>
        <div className="celebration-star star-four">⭐</div>

        <div className="celebration-heading">
          🎉 ANSWER REVEAL! 🎉
        </div>

        <div className="celebration-subtitle">
          🌿 {topic.title.toUpperCase()} 🌿
        </div>

        <div className="celebration-original">
          {prompt}
        </div>

        <div className="celebration-arrow">⬇</div>

        <div className="celebration-answer-box">
          <div className="celebration-answer-label">
            ✨ THE CORRECT ANSWER ✨
          </div>
          <div className="celebration-answer">
            {topic.answers[question - 1]}
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

// ==========================================
// BACK TO START TRAP
// ==========================================

function TrapPopup({ teamName, onContinue }) {
  return (
    <div
      className="trap-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Back to start trap"
    >
      <div className="trap-card">
        <div className="trap-skull">💀</div>
        <h2>OH NO!</h2>
        <h3>BACK TO START!</h3>
        <p>{teamName} landed on the trap!</p>
        <div className="trap-arrow">
          24 ⟶ 🏁 START
        </div>
        <button
          className="trap-continue"
          onClick={onContinue}
        >
          😱 BACK TO START!
        </button>
      </div>
    </div>
  )
}

// ==========================================
// MAIN APPLICATION
// ==========================================

export default function App() {
  const [page, setPage] = useState('home')
  const [gameType, setGameType] = useState('pastTense')
  const topic = gameTopics[gameType]

  const [teams, setTeams] = useState(initialTeams)
  const [turn, setTurn] = useState(0)
  const [dice, setDice] = useState(1)
  const [rolling, setRolling] = useState(false)
  const [moving, setMoving] = useState(false)
  const [question, setQuestion] = useState(null)
  const [answerPopup, setAnswerPopup] = useState(false)
  const [trapPopup, setTrapPopup] = useState(false)
  const [boardShaking, setBoardShaking] = useState(false)
  const [winner, setWinner] = useState(null)

  const [message, setMessage] = useState(
    'Team 1, roll the dice to begin!'
  )

  // Visual position is separate from the actual
  // numbered square. This is the important fix.
  const [visualPositions, setVisualPositions] = useState([
    centerOf(0),
    centerOf(0)
  ])

  const [specialMotion, setSpecialMotion] = useState(false)

  const timers = useRef([])
  const turnStart = useRef(0)
  const trapPending = useRef(false)
  const actionLocked = useRef(false)

  const busy =
    rolling ||
    moving ||
    question !== null ||
    answerPopup ||
    trapPopup ||
    trapPending.current ||
    actionLocked.current ||
    winner !== null

  function schedule(fn, ms) {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
    return id
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

  function updatePosition(player, square) {
    setTeams(prev =>
      prev.map((team, i) =>
        i === player
          ? { ...team, position: square }
          : team
      )
    )

    setVisualPositions(prev =>
      prev.map((pos, i) =>
        i === player ? centerOf(square) : pos
      )
    )
  }

  function resetGame() {
    cancelTimers()

    actionLocked.current = false
    trapPending.current = false
    turnStart.current = 0

    setTeams(initialTeams())
    setVisualPositions([centerOf(0), centerOf(0)])
    setTurn(0)
    setDice(1)
    setRolling(false)
    setMoving(false)
    setSpecialMotion(false)
    setQuestion(null)
    setAnswerPopup(false)
    setTrapPopup(false)
    setBoardShaking(false)
    setWinner(null)
    setMessage('Team 1, roll the dice to begin!')
  }

  function startGame(type) {
    resetGame()
    setGameType(type)
    setPage('game')
  }

  function getQuestionMessage(square) {
    if (topic.sentences) {
      return topic.sentences[square - 1]
    }

    return `${topic.instruction} "${topic.words[square - 1]}"!`
  }

  // ==========================================
  // NORMAL MOVEMENT
  // Square by square.
  // ==========================================

  function moveTeam(from, to, onComplete) {
    const player = turn

    if (from === to) {
      onComplete()
      return
    }

    const direction = to > from ? 1 : -1
    const steps = Math.abs(to - from)

    setMoving(true)
    actionLocked.current = true

    for (let step = 1; step <= steps; step++) {
      const square = from + step * direction

      schedule(() => {
        updatePosition(player, square)

        if (step === steps) {
          schedule(() => {
            setMoving(false)
            onComplete()
          }, STEP_TIME)
        }
      }, step * STEP_TIME)
    }
  }

  // ==========================================
  // SNAKE AND LADDER MOVEMENT
  //
  // Direct movement from the starting square
  // to the destination square.
  //
  // This does NOT count through numbered squares.
  // ==========================================

  function moveSpecial(from, to, onComplete) {
    const player = turn

    const start = centerOf(from)
    const end = centerOf(to)

    setMoving(true)
    setSpecialMotion(true)
    actionLocked.current = true

    const frames = 60
    const frameTime = SPECIAL_TIME / frames

    // The visual explorer travels directly
    // from the first point to the second.
    for (let frame = 1; frame <= frames; frame++) {
      schedule(() => {
        const progress = frame / frames

        // Smooth acceleration and deceleration.
        const eased =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2

        const x =
          start.x + (end.x - start.x) * eased

        const y =
          start.y + (end.y - start.y) * eased

        setVisualPositions(prev =>
          prev.map((pos, i) =>
            i === player ? { x, y } : pos
          )
        )

        if (frame === frames) {
          // Update the real square only at
          // the end of the special animation.
          setTeams(prev =>
            prev.map((team, i) =>
              i === player
                ? { ...team, position: to }
                : team
            )
          )

          schedule(() => {
            setSpecialMotion(false)
            setMoving(false)
            onComplete()
          }, 100)
        }
      }, frame * frameTime)
    }
  }

  // ==========================================
  // ROLL DICE
  // ==========================================

  function rollDice() {
    if (busy) return

    actionLocked.current = true

    const current = teams[turn].position
    const result = Math.floor(Math.random() * 6) + 1
    const destination = Math.min(30, current + result)

    // Save the starting square for incorrect answers.
    turnStart.current = current

    setDice(result)
    setRolling(true)
    setMessage(`${teams[turn].name} is rolling...`)

    schedule(() => {
      setRolling(false)

      if (destination === current) {
        setQuestion(current)
        setAnswerPopup(false)
        setMessage(
          `${teams[turn].name}, ${getQuestionMessage(current)}`
        )
        return
      }

      moveTeam(current, destination, () => {
        setQuestion(destination)
        setAnswerPopup(false)
        setMessage(
          `${teams[turn].name}, ${getQuestionMessage(destination)}`
        )
      })
    }, ROLL_TIME)
  }

  // ==========================================
  // NEXT TURN
  // ==========================================

  function nextTurn(feedback, destination) {
    if (destination === 30) {
      setWinner(turn)
      setMessage(`🏆 ${teams[turn].name} wins!`)
      setMoving(false)
      actionLocked.current = false
      return
    }

    const next = (turn + 1) % teams.length

    setTurn(next)
    setMoving(false)
    actionLocked.current = false

    setMessage(
      `${feedback} ${teams[next].name}, you're up!`
    )
  }

  // ==========================================
  // CORRECT AND INCORRECT ANSWERS
  // ==========================================

  function finishTurn(correct) {
    if (
      question === null ||
      moving ||
      answerPopup ||
      trapPopup ||
      trapPending.current
    ) {
      return
    }

    const square = question
    const start = turnStart.current
    const special = connectionAt[square]

    setQuestion(null)
    setAnswerPopup(false)

    // ----------------------------------------
    // INCORRECT ANSWER
    // Return to previous square.
    // ----------------------------------------

    if (!correct) {
      const answer = topic.answers[square - 1]

      setMessage(
        `❌ Incorrect! The answer is "${answer}". ` +
        `Move back to square ${start}.`
      )

      moveTeam(square, start, () => {
        nextTurn(
          `❌ Back to square ${start}!`,
          start
        )
      })

      return
    }

    // ----------------------------------------
    // CORRECT ANSWER
    // ----------------------------------------

    const feedback = 'Great answer!'

    // Back to Start trap.
    if (special?.type === 'trap') {
      trapPending.current = true
      actionLocked.current = true

      setTrapPopup(true)
      setBoardShaking(true)

      setMessage(
        `💀 OH NO! ${teams[turn].name} landed ` +
        `on the Back to Start trap!`
      )
      return
    }

    // ----------------------------------------
    // SNAKES AND LADDERS
    //
    // Always call moveSpecial here.
    // Never call moveTeam here.
    // ----------------------------------------

    if (
      special?.type === 'snake' ||
      special?.type === 'ladder'
    ) {
      const destination = special.to

      const specialMessage =
        special.type === 'snake'
          ? `🐍 Slide down to square ${destination}!`
          : `🪜 Climb up to square ${destination}!`

      setMessage(specialMessage)

      moveSpecial(square, destination, () => {
        nextTurn(
          `${feedback} ${specialMessage}`,
          destination
        )
      })

      return
    }

    // Normal correct answer.
    nextTurn(feedback, square)
  }

  // ==========================================
  // BACK TO START TRAP
  // ==========================================

  function activateTrap() {
    if (!trapPending.current) return

    setTrapPopup(false)
    setMoving(true)
    actionLocked.current = true

    schedule(() => {
      updatePosition(turn, 0)
      setBoardShaking(false)

      const next = (turn + 1) % teams.length

      setTurn(next)
      setMoving(false)

      trapPending.current = false
      actionLocked.current = false

      setMessage(
        `💀 Back to START! ${teams[next].name}, you're up!`
      )
    }, 450)
  }

  // ==========================================
  // HOME PAGE
  // ==========================================

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
                onClick={() => startGame('pastTense')}
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
                onClick={() => {
                  document
                    .getElementById('games')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                🐍 Choose a Snakes & Ladders Game
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
                  GRAMMAR
                </span>
                <h3>Snakes & Ladders</h3>
                <h4>Past Tense</h4>
                <p>
                  Roll the dice and practise past-tense
                  verbs such as go → went and eat → ate.
                </p>
                <button
                  className="play-button"
                  onClick={() => startGame('pastTense')}
                >
                  Play now →
                </button>
              </article>

              <article className="game-card">
                <div className="game-icon">🔥❄️</div>
                <span className="game-category">
                  VOCABULARY
                </span>
                <h3>Snakes & Ladders</h3>
                <h4>Opposite Adjectives</h4>
                <p>
                  Find the opposite adjectives!
                  Big → small, hot → cold,
                  happy → sad, and more.
                </p>
                <button
                  className="play-button"
                  onClick={() => startGame('opposites')}
                >
                  Play now →
                </button>
              </article>

              <article className="game-card">
                <div className="game-icon">📝🎲</div>
                <span className="game-category">
                  GRAMMAR
                </span>
                <h3>Snakes & Ladders</h3>
                <h4>Gerunds & Infinitives</h4>
                <p>
                  Complete 30 sentences using gerunds
                  (-ing) and infinitives (to + verb).
                </p>
                <button
                  className="play-button"
                  onClick={() =>
                    startGame('gerundsInfinitives')
                  }
                >
                  Play now →
                </button>
              </article>

              <article className="game-card">
                <div className="game-icon">😊😢😡</div>
                <span className="game-category">
                  VOCABULARY
                </span>
                <h3>Snakes & Ladders</h3>
                <h4>Feelings & Emotions</h4>
                <p>
                  Read everyday situations and guess
                  the correct feeling or emotion!
                </p>
                <button
                  className="play-button"
                  onClick={() => startGame('feelings')}
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
        // ======================================
        // GAME PAGE
        // ======================================

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
                resetGame()
                setPage('home')
              }}
            >
              ← Back to Games
            </button>

            <div className="game-title">
              <div className="game-kicker">
                THE CLASSROOM ADVENTURE
              </div>

              <h1>🐍 Snakes & Ladders 🪜</h1>
              <h2>{topic.title}</h2>

              <p>
                Roll the dice • Move your team •{' '}
                {topic.subtitle}
              </p>
            </div>
          </div>

          <div className="game-layout">
            {/* BOARD */}

            <section className="board-shell">
              <div className="board-banner">
                <span>🌟 RACE TO 30!</span>
                <span>🏆 FINISH LINE</span>
              </div>

              <div
                className={`board ${
                  boardShaking ? 'trap-shaking' : ''
                } ${
                  gameType === 'feelings'
                    ? 'feelings-board'
                    : ''
                }`}
              >
                <div className="board-grid">
                  {boardRows.flat().map(number => (
                    <div
                      className={`square shade-${number % 4} ${
                        number === 30
                          ? 'finish-square'
                          : ''
                      } ${
                        number === TRAP_SQUARE
                          ? 'trap-square'
                          : ''
                      }`}
                      key={number}
                    >
                      <span className="square-number">
                        {number}
                      </span>

                      {number === TRAP_SQUARE ? (
                        <div className="trap-square-content">
                          <span className="trap-square-icon">
                            💀
                          </span>
                          <strong>BACK TO START!</strong>
                        </div>
                      ) : (
                        <strong
                          className={
                            gameType === 'feelings'
                              ? 'emotion-emoji'
                              : ''
                          }
                        >
                          {topic.words[number - 1]}
                        </strong>
                      )}

                      {number === 30 && (
                        <span className="finish">
                          🏆
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <BoardArt />

                {/* =================================
                    ANIMATED EXPLORERS

                    Uses visualPositions, not
                    team.position.

                    This allows direct diagonal
                    snake and ladder movement.
                ================================= */}

                <div className="explorer-layer">
                  {teams.map((team, i) => {
                    const pos = visualPositions[i]

                    return (
                      <div
                        key={i}
                        className={`explorer explorer-${i}`}
                        style={{
                          left: `${pos.x / 6}%`,
                          top: `${pos.y / 5}%`,
                          transition: specialMotion
                            ? 'none'
                            : undefined
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
                <span> • </span>
                💀 Avoid square 24!
              </div>
            </section>

            {/* CONTROLS */}

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
                    : trapPopup
                    ? 'Oh no! A trap!'
                    : winner !== null
                    ? 'Game finished'
                    : '🎲 ROLL DICE'}
                </button>
              </section>

              <section className="message-panel">
                💬 {message}
              </section>

              {/* ENGLISH QUESTION */}

              <section className="question-panel">
                <span className="panel-eyebrow">
                  ✨ ENGLISH CHALLENGE
                </span>

                {question !== null ? (
                  <>
                    <p>{topic.question}</p>

                    <div className="challenge-word">
                      {topic.sentences
                        ? topic.sentences[question - 1]
                        : topic.words[question - 1]}
                    </div>

                    {gameType === 'feelings' && (
                      <p className="feelings-hint">
                        Say the emotion in English!
                      </p>
                    )}

                    <button
                      className="reveal-button"
                      onClick={() => setAnswerPopup(true)}
                    >
                      ✨ REVEAL THE ANSWER! ✨
                    </button>

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
                  </>
                ) : (
                  <div className="challenge-placeholder">
                    {winner !== null
                      ? '🏆 Game finished!'
                      : trapPopup
                      ? '💀 BACK TO START!'
                      : moving
                      ? '🚶 Explorer is moving...'
                      : '🎲 Roll the dice to get a question!'}
                  </div>
                )}
              </section>

              {winner !== null && (
                <section className="winner-panel">
                  🏆
                  <h2>{teams[winner].name} wins!</h2>
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

          {answerPopup && question !== null && (
            <AnswerCelebration
              question={question}
              topic={topic}
              onClose={() => setAnswerPopup(false)}
            />
          )}

          {trapPopup && (
            <TrapPopup
              teamName={teams[turn].name}
              onContinue={activateTrap}
            />
          )}
        </main>
      )}
    </div>
  )
}
