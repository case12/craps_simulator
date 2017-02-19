import React, { Component } from 'react';
import {LineChart, Line, XAxis, YAxis} from 'recharts';
import _ from 'lodash'

class StrategyGraph extends Component {

  static propTypes = {
    chipsData: React.PropTypes.array,
    enabled: React.PropTypes.bool,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.enabled) {
      return true;
    }
    return false;
  }

  render() {
    let data = this.props.chipsData;
    data = _.map(data, (datum) => { return {chips: datum}});
    return (
      <LineChart width={600} height={300} data={data}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis />
       <YAxis domain={['auto', 'auto']} />
       <Line type="monotone" dataKey="chips" stroke="#8884d8" dot={false} isAnimationActive={true} />
      </LineChart>
    );
  }
}

export default StrategyGraph;
