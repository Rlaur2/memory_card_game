import './stylesheets/Header.css'

export const Header = ({score, bestScore}) => {
  return (
    <header>
        <div className="title">Food Memory Game</div>
        <div className="current-score">Current Score: {score}</div>
        <div className="best-score">Best Score: {bestScore}</div>
    </header>
  )
}
