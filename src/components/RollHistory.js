import React, { Component } from 'react';
import _ from 'lodash';
import './styles.css';


class RollHistory extends Component {

  static propTypes = {
    history: React.PropTypes.array,
  };

  render() {
    let { history } = this.props;
    let slice = _.takeRight(history, 10);
    let prettyHistory = _.map(slice, (roll) => { return roll.a + roll.b; });

    let histogram = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    _.forEach(history, (roll) => {
      let total = roll.a + roll.b;
      histogram[total-2]++;
    });

    return (
      <p>
        Roll History: {JSON.stringify(prettyHistory)}
        <br />
        Total Rolls: {history.length}
        <br />
        {JSON.stringify(histogram)}
      </p>
    );
  }
}

export default RollHistory;
