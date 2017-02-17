import { roll, betPassLine } from '../actions'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import LastRoll from '../components/LastRoll';
import RollHistory from '../components/RollHistory';
import Player from '../components/Player';
import { Button } from 'react-bootstrap';
import './styles.css';

class Craps extends Component {
  constructor(props) {
    super(props);
  }

  getRandomNumber = () => {
    return Math.floor(Math.random() * 6) + 1;
  }

  onRoll = () => {
    let {getRandomNumber} = this;
    let {rollDice} = this.props;

    rollDice(getRandomNumber(), getRandomNumber());
  }

  onBet = () => {
    this.props.betPassLine(1);
  }

  onTryStrategy = () => {

    setInterval(() => {
      let { rolls, player, point, comeOut } = this.props;

      if (comeOut === true && player.bets.pass === 0) {
        this.props.betPassLine(5);
      }
      this.onRoll();

    }, 5);
  }

  render() {
    let { onRoll, onBet, onTryStrategy } = this;
    let { rolls, player, point, comeOut } = this.props;

    let lastRoll = null;
    if (rolls.length > 0) {
      lastRoll = rolls[rolls.length - 1];
      lastRoll = <LastRoll dieA={lastRoll.a} dieB={lastRoll.b} />
    }

    let currentPoint = comeOut == true ? 'None' : point;

    return (
      <div>
        <h2>Craps</h2>
        <h3>
          Current Point: {currentPoint}
        </h3>
        <p>
          <Button bsStyle="success" onClick={onRoll}>Roll</Button>
          {lastRoll}
        </p>
        <RollHistory history={rolls} />
        <Button onClick={onBet}>Bet 5</Button>
        <Player player={player} />

        <Button onClick={onTryStrategy}>Try Strategy</Button>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    rollDice: (a, b) => dispatch(roll(a, b)),
    betPassLine: (amount) => dispatch(betPassLine(amount)),
  };
}

function mapStateToProps(state) {
  return {
    rolls: state.rolls.toJS().history,
    player: state.craps.toJS().player,
    point: state.craps.toJS().point,
    comeOut: state.craps.toJS().comeOut
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Craps);
