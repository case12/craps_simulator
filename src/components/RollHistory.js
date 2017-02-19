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

    return (
      <div>
        <p>
          Total Rolls: {history.length}
        </p>
        <RollChart rollHistory={history} enabled={this.props.enabled}/>
      </div>
    );
  }
}

export default RollHistory;
