import React, { Component } from 'react';
import ComeBets from './ComeBets'
import LineBet from './LineBet'
import './styles.css'

class Player extends Component {

  static propTypes = {
    player: React.PropTypes.object,
    point: React.PropTypes.number,
  };

  render() {
    let { player, point } = this.props;
    return (
      <div className='board bg-color'>
          <ComeBets point={point} comeBet={player.bets.come.line} numberBets={player.bets.come.numbers} oddsBets={player.bets.come.odds} />
          <LineBet label='Come' bet={player.bets.come.line} />
          <LineBet label='Pass' bet={player.bets.pass} />
          <h2>Chips: {player.chips}</h2>
      </div>
    );
  }
}

export default Player;
