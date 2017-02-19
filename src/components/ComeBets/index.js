import React, { Component } from 'react';
import _ from 'lodash';
import ComeNumber from './ComeNumber'
import './styles.css'

class ComeBets extends Component {

  render() {
    let { numberBets, oddsBets, point } = this.props;
    let numbers = [4, 5, 6, 8, 9, 10]

    return (
      <div className='come-root'>
        <div className='come-numbers'>
          {
            _.map(numbers, index =>
              <ComeNumber key={index} point={point} number={index} numberChips={numberBets[index]} oddsChips={oddsBets[index]} />
            )
          }
        </div>
      </div>
    );
  }
}

ComeBets.propTypes = {
    point: React.PropTypes.number,
    numberBets: React.PropTypes.array,
    oddsBets: React.PropTypes.array,
  };

export default ComeBets;
