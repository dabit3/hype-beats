import React, { useState, useEffect } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { Link } from 'react-router-dom'

import { listBeatboxs } from './graphql/queries'

const fetchBeatBoxes = async (updater) => {
  try {
    const data = await API.graphql(graphqlOperation(listBeatboxs))
    updater(data.data.listBeatboxs.items)
  } catch (err) {
    console.log('error: ', err)
  }
}

const Machines = () => {
  const [beatboxes, updateBeatBoxes] = useState([])
  useEffect(() => {
    fetchBeatBoxes(updateBeatBoxes)
  }, [])
  console.log('beatboxes:', beatboxes)
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Hype Beats</h1>
      {
        beatboxes.map((b, i) => (
          <Link key={i} to={`/machine/${b.id}`} style={styles.link}>
            <h1 style={styles.title}>{b.name}</h1>
          </Link>
        ))
      }
    </div>
  )
}

const styles = {
  container: {
    padding: '0px 30px'
  },
  heading: {
    color: '#4deeea',
    fontFamily: 'goodtimes'
  },
  link: {
    textDecoration: 'none'
  },
  title: {
    fontFamily: 'stilltime',
    color: '#74ee15',
    padding: '0px 20px 0px 0px',
    cursor: 'pointer'
  }
}

export default Machines