import _ from 'lodash'

export default function comeDontPassStrategy(props) {
    let { player, comeOut } = props;

    let numbersOccupied = _.reduce(player.bets.come.numbers, (sum, n) => {
      return sum + ((n > 0) ? 1 : 0);
    }, 0);

    // if (comeOut === false && player.bets.pass > 0) {
    //   numbersOccupied++;
    // }

    let myCurrentMaxBet = 0;
    let myDesiredOdds = 0;
    switch(numbersOccupied) {
    case 0:
      myCurrentMaxBet = 5;
      myDesiredOdds = 0;
      break;
    case 1:
      myCurrentMaxBet = 5;
      myDesiredOdds = 0;
      break;
    case 2:
      myCurrentMaxBet = 5;
      myDesiredOdds = 0;
      break;
    case 3:
      myCurrentMaxBet = 5;
      myDesiredOdds = 0;
      break;
    case 4:
      myCurrentMaxBet = 5;
      myDesiredOdds = 40;
      break;
    case 5:
      myCurrentMaxBet = 5;
      myDesiredOdds = 40;
      break;
    case 6:
      myCurrentMaxBet = 5;
      myDesiredOdds = 40;
      break;
    }

    // myCurrentMaxBet = 5;
    // myDesiredOdds = 5;
    if (comeOut === false) {
      // Bet the come to keep getting chips on numbers
      // if (numbersOccupied === 0) {
      props.betCome(myCurrentMaxBet);
      // }

      // Bet the dont pass odds if necessary for insurance
      let desiredDPOddsBet = 5 + numbersOccupied * 5;
      if (player.bets.dontPassOdds < desiredDPOddsBet) {
        props.betDontPassOdds(desiredDPOddsBet - player.bets.dontPassOdds);
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
      if (player.bets.dontPass === 0) {
        props.betDontPass(5);
      }
    }
  }
