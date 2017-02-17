import React, { Component } from 'react';

class Player extends Component {

  static propTypes = {
    player: React.PropTypes.object,
  };

  render() {
    let { player } = this.props;

    return (
      <div>
          <h4>Chips: {player.chips}</h4>
          <h5>{JSON.stringify(player.bets)}</h5>
      </div>
    );
  }
}

export default Player;
