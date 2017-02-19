import React, { Component } from 'react';
import _ from 'lodash';
import RollChart from './RollChart'
import './styles.css';


class RollHistory extends Component {

  static propTypes = {
    history: React.PropTypes.array,
    enabled: React.PropTypes.bool,
  };

  render() {
    let { history } = this.props;
    let slice = _.takeRight(history, 10);
    let prettyHistory = _.map(slice, (roll) => { return roll.a + roll.b; });

    return (
      <div>
        <p>
          Roll History: {JSON.stringify(prettyHistory)}
          <br />
          Total Rolls: {history.length}
        </p>
        <RollChart rollHistory={history} enabled={this.props.enabled}/>
      </div>
    );
  }
}

export default RollHistory;
