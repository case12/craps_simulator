import React, { Component } from 'react';
import _ from 'lodash';
import './styles.css'

class LineBet extends Component {

  render() {
    let { label, bet } = this.props;


    return (
      <div className='line-container'>
        <p>{label}: {bet}</p>
      </div>
    );
  }
}

LineBet.propTypes = {
    label: React.PropTypes.string.isRequired,
    bet: React.PropTypes.number.isRequired,
  };

export default LineBet;
