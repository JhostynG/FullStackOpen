import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = () => <h1>Give feedback</h1>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const average = (good, bad, all) => {
  if(all===0){
    return 0
  }
  return (good-bad)/all
}

const percentage = (num, total) => {
  if(total===0){
    return 0
  }
  return num*100/total
}

const StatisticsLine = (props) => (
  <tr>
    <td>{props.text}</td>
    <td>{props.value}</td>
  </tr>
)

const Statistics = (props) => {

  if(props.all === 0){
    return(
      <div>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticsLine text="good" value={props.good} />
          <StatisticsLine text="neutral" value={props.neutral} />
          <StatisticsLine text="bad" value={props.bad} />
          <StatisticsLine text="all" value={props.all} />
          <StatisticsLine text="average" value={average(props.good,props.bad,props.all)} />
          <StatisticsLine text="positive" value={percentage(props.good,props.all)+" %"} />
        </tbody>
      </table>
    </div>
  ) 
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allClicks, setAll] = useState(0)

  const handleGoodClick = () => {
    setAll(allClicks+1)
    setGood(good+1)
  }

  const handleNeutralClick = () => {
    setAll(allClicks+1)
    setNeutral(neutral+1)
  }

  const handleBadClick = () => {
    setAll(allClicks+1)
    setBad(bad+1)
  }

  return (
    <div>
      <Header/>
      <Button handleClick={handleGoodClick} text={"Good"} />
      <Button handleClick={handleNeutralClick} text={"Neutral"} />
      <Button handleClick={handleBadClick} text={"Bad"} />
      <Statistics good={good} bad={bad} neutral={neutral} all={allClicks} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)