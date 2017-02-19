import { roll, betPassLine, betCome, betComeOdds, betComeNumber } from '../actions'
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

  onTryStrategy = () => {
    this.disableAnalytics();
    clearInterval(strategyInterval);
    strategyInterval = setInterval(() => {
      this.comeStrategy();
      this.roll();

    }, intervalValue);
  }

  passBetStrategy = () => {
      let { player, comeOut } = this.props;

      if (comeOut === true && player.bets.pass === 0) {
        this.props.betPassLine(5);
      }
  }

  comeStrategy = () => {
    let { player, comeOut } = this.props;

    let numbersOccupied = _.reduce(player.bets.come.numbers, (sum, n) => {
      return sum + ((n > 0) ? 1 : 0);
    }, 0);
    let myCurrentMaxBet = numbersOccupied * 5;
    myCurrentMaxBet = _.min([25, myCurrentMaxBet]);
    if (comeOut === false) {
      this.props.betCome(_.max([5, myCurrentMaxBet]));

      // Even out numbers on come bets
      _.map(player.bets.come.numbers, (value, index) => {
        if (value > 0) {
          let currentComeOdds = player.bets.come.odds[index];
          let desiredBet = numbersOccupied * 5;
          this.props.betComeOdds(index, desiredBet - currentComeOdds);
        }
      })

    }
    else {
      if (player.bets.pass === 0) {
        this.props.betPassLine(_.max([5, myCurrentMaxBet]));
      }
    }
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

  render() {
    let { onRollButton, onBetPass, onBetCome, onTryStrategy, onStopStrategy, onSliderChange, comeStrategy} = this;
    let { rolls, player, point, comeOut, chipHistory } = this.props;

    let lastRoll = null;
    if (rolls.length > 0) {
      lastRoll = rolls[rolls.length - 1];
      lastRoll = <LastRoll dieA={lastRoll.a} dieB={lastRoll.b} />
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
          <h2>Craps</h2>
          <h2>Current Point: {currentPoint}</h2>
          <h1>
            {lastRoll}
          </h1>
          <Player player={player} />
          <div>
            <Button className='bet-button' bsStyle="warning" onClick={comeStrategy}>Auto Bet</Button>
            <Button className='bet-button' bsStyle="warning" onClick={onBetPass}>Bet 5 Pass Line</Button>
            <Button className='bet-button' bsStyle="warning" onClick={onBetCome}>Bet 5 Come</Button>
          </div>
          <Button className='roll-button' bsSize='large' bsStyle="success" onClick={onRollButton}>Roll</Button>
          <Button className='bet-button' bsStyle="info" onClick={onTryStrategy}>Try Strategy</Button>
          <Button className='bet-button' bsStyle="danger" onClick={onStopStrategy}>Stop</Button>
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
