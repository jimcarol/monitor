"use client"; // This is a client component 👈🏽

import ChartView from './chart'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FormControl, Grid, InputLabel, Select } from '@material-ui/core'
import moment from 'moment'
import axios from 'axios'

const Index = () => {

  const useStyles = makeStyles((theme) => ({

    urlSelector: {
      margin: theme.spacing(1),
      width: '90%'
    },
    chart: {
      overflow: 'scroll'
    }
  }))
  const classes = useStyles()

  const scoreOptions = ['performance', 'first-contentful-paint', 'interactive', 'speed-index', 'total-blocking-time', 'largest-contentful-paint','cumulative-layout-shift']

  const [stgData, setStgData] = useState({})
  const [prodData, setProdData] = useState({})

  const [scoreOption, setScoreOption] = useState(scoreOptions[0])
  const [stgUrl, setStgUrl] = useState('')
  const [prodUrl, setProdUrl] = useState('')
  const [stgChartData, setStgChartData] = useState(null)
  const [prodChartData, setProdChartData] = useState(null)

  useEffect(() => {
    (axios({ url: '/prod-result.json' }).then(data => {
      setProdData(data.data)
    }))
  }, [])

  useEffect(() => {
    (axios({ url: '/stg-result.json' }).then(data => {
      setStgData(data.data)
    }))
  }, [])

  const handleScoreOptionChange = (e: any) => {
    setScoreOption(e.target.value)
    if (stgUrl)
      setStgChartData(getChartData((stgData as any)[stgUrl], e.target.value))

    if (prodUrl)
      setProdChartData(getChartData((prodData as any)[prodUrl], e.target.value))
  }

  const handleStgUrlChange = (e: any) => {
    setStgUrl(e.target.value)
    let data = null
    if (e.target.value) {
      data = getChartData((stgData as any)[e.target.value], scoreOption)
    }
    setStgChartData(data)
  }

  const handleProdUrlChange = (e: any) => {
    setProdUrl(e.target.value)
    let data = null
    if (e.target.value) {
      data = getChartData((prodData as any)[e.target.value], scoreOption)
    }
    setProdChartData(data)
  }

  const getChartData = (data:any, option:any): any => {

    const item = data[option]
    const dataData: any = {}
    const tmp: any = []
    const devices = Object.keys(item)
    devices.forEach(device => {
      const days = Object.keys(item[device])

      days.forEach(day => {

        if (!dataData[day]) {
          dataData[day] = { date: day }
          tmp.push(dataData[day])

        }
        dataData[day][device] = item[device][day]
      })
    })
    if (tmp.length > 8) {
      for (let i of tmp) {
        i.date = moment(i.date).toDate()
      }
    }
    return tmp
  }

  const getScoreOptionList = () => {
    return scoreOptions.map((option) => { return (<option key={option} value={option}>{option}</option>)})
  }

  const getUrlList = (env: any) => {
    let urls
    if (env === 'stg') {
      urls = Object.keys(stgData)
    } else {
      urls = Object.keys(prodData)

    }
    return urls.map((url) => { return (<option key={url} value={url}>{url}</option>)})
  }

  return (

      <Grid container>

        <Grid item sm={12}>
          <FormControl className={classes.urlSelector}>
            <InputLabel htmlFor="age-native-simple">Score</InputLabel>
            <Select
              native
              value={scoreOption}
              onChange={handleScoreOptionChange}>
              <option aria-label="None" value="" />
              {getScoreOptionList()}
            </Select>
          </FormControl>
        </Grid>

        <Grid item sm={12}>
          <FormControl className={classes.urlSelector}>
            <InputLabel htmlFor="age-native-simple">Production</InputLabel>
            <Select
              native
              value={prodUrl}
              onChange={handleProdUrlChange}>
              <option aria-label="None" value="" />
              {getUrlList('prod')}
            </Select>
          </FormControl>
          <ChartView data={prodChartData} scoreName={scoreOption} />
        </Grid>
        <Grid item sm={12}>
          <FormControl className={classes.urlSelector}>
            <InputLabel htmlFor="age-native-simple">Stg / QA</InputLabel>
            <Select
              native
              value={stgUrl}
              onChange={handleStgUrlChange}>
              <option aria-label="None" value="" />
              {getUrlList('stg')}
            </Select>
          </FormControl>
          <ChartView data={stgChartData} scoreName={scoreOption} />
        </Grid>

      </Grid>
  )
}

export default Index