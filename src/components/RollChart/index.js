import React, { Component } from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import _ from 'lodash';

class RollChart extends Component {

  static propTypes = {
    rollHistory: React.PropTypes.array,
    enabled: React.PropTypes.bool,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.enabled && nextProps.rollHistory.length !== this.props.rollHistory.length) {
      return true;
    }
    return false;
  }

  render() {
    let history = this.props.rollHistory;

    let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    data = _.fill(data, _.clone({value: 0, index: 0}));
    data = _.map(data, () => {
      return {value: 0, index: 0}
    });

    _.times(data.length, (index) => {
      data[index].index = index + 2;
    })

    _.forEach(history, (roll) => {
      let total = roll.a + roll.b;
      data[total-2].value++;
    });

    return (
      <div>
        <BarChart width={600} height={250} data={data}>
          <XAxis dataKey="index" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" isAnimationActive={true} />
        </BarChart>
      </div>
    );
  }
}

export default RollChart;
