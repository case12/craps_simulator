import React, { Component } from 'react';

class LastRoll extends Component {

  static propTypes = {
    dieA: React.PropTypes.number,
    dieB: React.PropTypes.number,
  };

  render() {
    let { dieA, dieB } = this.props;

    return (
      <span>
          Last Roll: {dieA + dieB} ({dieA} , {dieB})
      </span>
    );
  }
}

export default LastRoll;
