import React, { useState, useEffect } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { Link } from 'react-router-dom'
import uuid from 'uuid/v4'

import { listBeatboxs } from './graphql/queries'

const fetchBeatBoxes = async (updater) => {
  try {
    const data = await API.graphql(graphqlOperation(listBeatboxs))
    updater(data.data.listBeatboxs.items)
  } catch (err) {
    console.log('error: ', err)
  }
}

const navigate = (name, history) => {
  const id = uuid()
  history.push(`/machine/${id}/${name}`)
}

const Machines = (props) => {
  const [beatboxes, updateBeatBoxes] = useState([])
  const [input, setInput] = useState(null)
  const [modalVisible, setModal] = useState(false)

  useEffect(() => {
    fetchBeatBoxes(updateBeatBoxes)
  }, [])

  return (
    <div style={styles.container}>
      <div>
        <h1 style={styles.heading}>Hype Beats</h1>
        <button
          onClick={() => setModal(!modalVisible)}
          style={styles.button}>Create Beatbox</button>
      </div>
      {
        beatboxes.map((b, i) => (
          <Link key={i} to={`/machine/${b.id}/${b.name}`} style={styles.link}>
            <h1 style={styles.title}>{b.name}</h1>
          </Link>
        ))
      }
      {
        modalVisible && (
          <div style={styles.modal}>
            <h2>New Beatbox</h2>
            <input
              style={styles.input}
              placeholder='Name'
              onChange={e => setInput(e.target.value)}
            />
            <button
              onClick={() => navigate(input, props.history)}
              style={{...styles.button, ...styles.createButton}}>
              Create
            </button>
          </div>
        )
      }
    </div>
  )
}

const styles = {
  input: {
    padding: 10,
    outline: 'none',
    fontSize: 16,
    marginBottom: 10
  },
  button: {
    backgroundColor: '#ffe700',
    height: 40,
    width: 200,
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#666',
    fontSize: 13,
    fontFamily: 'goodtimes'
  },
  createButton: {
    backgroundColor: '#ff32ff'
  },
  modal: {
    padding: '0px 25px',
    position: 'fixed',
    zIndex: 100,
    width: 400,
    height: 200,
    top: 'calc(50% - 100px)',
    left: 'calc(50% - 200px)',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column'
  },
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