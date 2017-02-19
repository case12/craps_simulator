import React, { Component } from 'react';
import _ from 'lodash';
import './styles.css'

class ComeNumber extends Component {

  render() {
    let { number, numberChips, oddsChips } = this.props;

    return (
      <div className='come-number border-color'>
        <div className='number main-color'>
          {number}
        </div>
        <div className='chips secondary-color'>
          {numberChips}
        </div>
        <div className='odds-chips tertiary-color'>
          {oddsChips}
        </div>
      </div>
    );
  }
}

ComeNumber.propTypes = {
    number: React.PropTypes.number.isRequired,
    numberChips: React.PropTypes.number.isRequired,
    oddsChips: React.PropTypes.number.isRequired,
  };

export default ComeNumber;
