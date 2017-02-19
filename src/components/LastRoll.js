import React, { Component } from 'react';

class LastRoll extends Component {

  static propTypes = {
    dieA: React.PropTypes.number,
    dieB: React.PropTypes.number,
  };

  render() {
    let { dieA, dieB } = this.props;

    return (
      <p className='last-roll'>
        {dieA} <strong className='tertiary-color'>{dieA + dieB}</strong> {dieB}
      </p>
    );
  }
}

export default LastRoll;
