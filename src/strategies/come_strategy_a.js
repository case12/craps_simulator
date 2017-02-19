import _ from 'lodash'

export default function comeStrategy(props) {
    let { player, comeOut } = props;

    let numbersOccupied = _.reduce(player.bets.come.numbers, (sum, n) => {
      return sum + ((n > 0) ? 1 : 0);
    }, 0);

    let myCurrentMaxBet = 0;
    let myDesiredOdds = 0;
    switch(numbersOccupied) {
    case 1:
      myCurrentMaxBet = 5;
      myDesiredOdds = 0;
      break;
    case 2:
      myCurrentMaxBet = 5;
      myDesiredOdds = 0;
      break;
    case 3:
      myCurrentMaxBet = 10;
      myDesiredOdds = 5;
      break;
    case 4:
      myCurrentMaxBet = 10;
      myDesiredOdds = 10;
      break;
    case 5:
      myCurrentMaxBet = 20;
      myDesiredOdds = 15;
      break;
    case 6:
      myCurrentMaxBet = 35;
      myDesiredOdds = 25;
      break;
    }

    myCurrentMaxBet = 5;
    myDesiredOdds = 5;
    if (comeOut === false) {
      if (numbersOccupied === 0) {
        props.betCome(_.max([5, myCurrentMaxBet]));
      }

      // Even out numbers on come bets
      _.map(player.bets.come.numbers, (value, index) => {
        if (value > 0) {
          let currentComeOdds = player.bets.come.odds[index];
          props.betComeOdds(index, myDesiredOdds - currentComeOdds);
        }
      })

    }
    else {
      if (player.bets.pass === 0) {
        props.betPassLine(_.max([5, myCurrentMaxBet]));
      }
    }
  }
