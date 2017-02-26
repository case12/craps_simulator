import { roll, betPassLine, betCome, betComeOdds, betComeNumber, reset, betDontPass, betDontPassOdds } from '../actions'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import LastRoll from '../components/LastRoll';
import RollHistory from '../components/RollHistory';
import Player from '../components/Player';
import { Button } from 'react-bootstrap';
import StrategyGraph from '../components/StrategyGraph'
const Slider = require('rc-slider');
const Tooltip = require('rc-tooltip');
const Handle = Slider.Handle;
import './styles.css';
import 'rc-slider/assets/index.css';
import _ from 'lodash';
import currentBetStrategy from '../strategies/come_strategy_a'

let strategyInterval = -1;
let intervalValue = 5;

class Craps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allowAnalyticsUpdates: true,
    };
  }

  getRandomNumber = () => {
    return Math.floor(Math.random() * 6) + 1;
  }

  roll = () => {
    let {getRandomNumber} = this;
    let {rollDice} = this.props;

    rollDice(getRandomNumber(), getRandomNumber());
  }

  onRollButton = () => {
    this.roll();
  }

  onBetPass = () => {
    this.props.betPassLine(5);
  }

  onBetCome = () => {
    this.props.betCome(5);
  }

  onBetDontPass = () => {
    this.props.betDontPass(5);
  }

  onBetDontPassOdds = () => {
    this.props.betDontPassOdds(5);
  }

  onTryStrategy = () => {
    this.disableAnalytics();
    clearInterval(strategyInterval);
    strategyInterval = setInterval(() => {
      this.betStrategy();
      this.roll();

    }, intervalValue);
  }

  betStrategy = () => {
    currentBetStrategy({
      player: this.props.player,
      comeOut: this.props.comeOut,
      betPassLine: this.props.betPassLine,
      betCome: this.props.betCome,
      betComeNumber: this.props.betComeNumber,
      betComeOdds: this.props.betComeOdds,
      betDontPass: this.props.betDontPass,
      betDontPassOdds: this.props.betDontPassOdds,
    })
  }

  updateAnalytics = () => {
    this.setState({
      allowAnalyticsUpdates: true,
    })
  }

  disableAnalytics = () => {
    this.setState({
      allowAnalyticsUpdates: false,
    })
  }

  onStopStrategy = () => {
    clearInterval(strategyInterval);
    this.updateAnalytics();
  }

  onSliderChange = (value) => {
    intervalValue = value;
  }

  onReset = () => {
    this.props.reset();
  }

  render() {
    let { onRollButton, onBetPass, onBetCome, onTryStrategy, onStopStrategy, onSliderChange, betStrategy, onReset, onBetDontPass, onBetDontPassOdds} = this;
    let { rolls, player, point, comeOut, chipHistory } = this.props;

    let lastRoll = null;
    if (rolls.length > 0) {
      lastRoll = rolls[rolls.length - 1];
      lastRoll = <LastRoll dieA={lastRoll.a} dieB={lastRoll.b} />
    }
    else {
      lastRoll = <LastRoll dieA={0} dieB={0} />
    }

    let currentPoint = comeOut === true ? 'None' : point;
    const handle = (props) => {
      const { value, dragging, index, ...restProps } = props;
      return (
        <Tooltip
          overlay={value}
          visible={dragging}
          placement="top"
          key={index}
        >
          <Handle {...restProps} />
        </Tooltip>
      );
    };
    const wrapperStyle = { width: 400, margin: 50 };
    return (
      <div className='root'>
        <div className='left'>
          <p className='short-roll-history'>
            {JSON.stringify(_.map(_.dropRight(_.takeRight(rolls, 11)), (roll) => { return roll.a + roll.b; }))}
          </p>
          {lastRoll}
          <Player player={player} point={point} />
          <div>
            <Button className='bet-button' bsStyle="warning" onClick={betStrategy}>Auto Bet</Button>
            <Button className='bet-button' bsStyle="warning" onClick={onBetPass}>Bet Pass Line</Button>
            <Button className='bet-button' bsStyle="warning" onClick={onBetCome}>Bet Come</Button>
            <Button className='bet-button' bsStyle="warning" onClick={onBetDontPass}>Bet Dont Pass</Button>
            <Button className='bet-button' bsStyle="warning" onClick={onBetDontPassOdds}>Bet DP Odds</Button>
          </div>
          <Button className='roll-button' bsSize='large' bsStyle="success" onClick={onRollButton}>Roll</Button>
          <div>
            <Button className='bet-button' bsStyle="info" onClick={onTryStrategy}>Try Strategy</Button>
            <Button className='bet-button' bsStyle="warning" onClick={onStopStrategy}>Stop</Button>
          </div>
          <Button className='bet-button' bsStyle="danger" onClick={onReset}>Reset</Button>
          <div style={wrapperStyle}>
            <Slider min={5} max={1000} defaultValue={intervalValue} onChange={onSliderChange} handle={handle} />
          </div>

        </div>
        <div className='right'>
          <RollHistory history={rolls} enabled={this.state.allowAnalyticsUpdates} />
          <StrategyGraph chipsData={chipHistory} enabled={this.state.allowAnalyticsUpdates} />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    rollDice: (a, b) => dispatch(roll(a, b)),
    betPassLine: (amount) => dispatch(betPassLine(amount)),
    betCome: (amount) => dispatch(betCome(amount)),
    betComeNumber: (number, amount) => dispatch(betComeNumber(number, amount)),
    betComeOdds: (number, amount) => dispatch(betComeOdds(number, amount)),
    betDontPass: (amount) => dispatch(betDontPass(amount)),
    betDontPassOdds: (amount) => dispatch(betDontPassOdds(amount)),
    reset: () => dispatch(reset()),
  };
}

function mapStateToProps(state) {
  return {
    rolls: state.rolls.toJS().history,
    player: state.craps.toJS().player,
    point: state.craps.toJS().point,
    comeOut: state.craps.toJS().comeOut,
    chipHistory: state.craps.toJS().player.chipHistory
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Craps);
