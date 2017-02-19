export default function passBetStrategy(props) {
    let { player, comeOut } = props;

    if (comeOut === true && player.bets.pass === 0) {
      props.betPassLine(5);
    }
}
