"use client"; 

import React from 'react'
import Paper from '@material-ui/core/Paper'
import { ArgumentAxis, Chart, Legend, LineSeries, Tooltip, ValueAxis, ZoomAndPan } from '@devexpress/dx-react-chart-material-ui'
import { ArgumentScale, EventTracker, ScatterSeries, ValueScale } from '@devexpress/dx-react-chart'
import { scaleTime } from 'd3-scale'



const ChartView = ({ data, scoreName }: any) => {

  if (!data)
    return null

  let visualRange
  if (scoreName === 'performance') {
    visualRange = () => [0, 100]
  } else if (scoreName === 'first-contentful-paint') {
    visualRange = () => [0, 10]
  } else if (scoreName === 'largest-contentful-paint') {
    visualRange = () => [0, 20]
  } else if (scoreName === 'cumulative-layout-shift') {
    visualRange = () => [0, 1]
  } else {
    visualRange = () => [0, 60]
  }

  const getArgumentScale = () => {
    if (data.length > 8) {
      return (<ArgumentScale factory={scaleTime} />)
    } else {
      return null
    }
  }

  const labelComponent = (props: any) => {
    if (props.text.includes('hidden')) {
      return null
    }

    return <Legend.Label {...props}  />;
  };

  const markerComponent = (props: any) => {
    if (props.name.includes('hidden')) {
      return null
    }
    return <Legend.Marker {...props}  />;
  }

  return (
    <Paper>
      <Chart data={data}>
        <ArgumentAxis />
        {getArgumentScale()}
        <ValueAxis />
        <ValueScale modifyDomain={visualRange} />

        <LineSeries name="Desktop Line" valueField="desktop" argumentField="date" />
        <LineSeries name="Mobile Line" valueField="mobile" argumentField="date" />
        

        <ScatterSeries valueField="desktop" argumentField="date" name={'Desktop Point'}/>
        <ScatterSeries valueField="mobile" argumentField="date" name={'Mobile Point'}/>
        {/*<LineSeries name="amp" valueField="amp" argumentField="date" />*/}

        <Legend labelComponent={labelComponent} markerComponent={markerComponent}/>
        <EventTracker />
        <Tooltip />
        <ZoomAndPan
          interactionWithArguments="both"
          interactionWithValues="none"
        />
      </Chart>
    </Paper>
  )
}
export default ChartView