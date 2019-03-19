import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import uuid from 'uuid/v4'
import { graphql } from 'react-apollo'
import styled from 'styled-components'
import { buildSubscription } from 'aws-appsync'

import { listDrumMachines } from './graphql/queries'
import { onCreateDrumMachine } from './graphql/subscriptions'

const ListContainer = styled.div`
  height: calc(100vh - 200px);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  @media (max-width: 440px) {
    height: calc(100vh - 220px);
  }
`

const navigate = (name, history) => {
  const id = uuid()
  history.push(`/machine/${id}/${name}`)
}

const Machines = (props) => {
  const { drumMachines } = props
  const [input, setInput] = useState(null)
  const [modalVisible, setModal] = useState(false)

  useEffect(() => {
    props.data.subscribeToMore(
      buildSubscription(onCreateDrumMachine, listDrumMachines)
    )
  })

  return (
    <div style={styles.container}>
      <div>
        <h1 style={styles.heading}>Hype Beats</h1>
        <button
          onClick={() => setModal(!modalVisible)}
          style={styles.button}>Create Machine</button>
      </div>
      <ListContainer>
      {
        drumMachines.map((b, i) => (
          <Link key={i} to={`/machine/${b.id}/${b.name}`} style={styles.link}>
            <h1 style={styles.title}>{b.name}</h1>
          </Link>
        ))
      }
      </ListContainer>
      {
        modalVisible && (
          <div style={styles.modal}>
            <h2>New Drum Machine</h2>
            <input
              style={styles.input}
              placeholder='Name'
              onChange={e => setInput(e.target.value)}
            />
            <button
              onClick={() => {
                if (!input) return
                navigate(input, props.history)
              }}
              style={{...styles.button, ...styles.createButton}}>
              Create
            </button>
            <button
              onClick={() => setModal(!modalVisible)}
              style={{...styles.button, ...styles.cancelButton}}>
              Cancel
            </button>
          </div>
        )
      }
      <div style={styles.links}>
        <p style={styles.hrefs}>Built with <a target="_blank" style={styles.href} href="https://github.com/kenwheeler/hooks-drum-machine">Hooks Drum Machine</a> by <a target="_blank" style={styles.href} href="https://twitter.com/ken_wheeler">Ken Wheeler</a>, <a target="_blank" style={styles.href} href="https://aws-amplify.github.io/">AWS Amplify</a>, & <a target="_blank" style={styles.href} href="https://aws.amazon.com/appsync/">AWS AppSync</a>. <a target="_blank" href="https://github.com/dabit3/hype-beats" style={styles.href2}>View Code</a></p>
      </div>
    </div>
  )
}

const AppWithData = graphql(
  listDrumMachines, {
    options: {
      fetchPolicy: 'cache-and-network'
    },
    props: props => ({
      drumMachines: props.data.listDrumMachines ? props.data.listDrumMachines.items : [],
      data: props.data
    })
  }
)(Machines)

const styles = {
  links: {
    display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end'
  },
  hrefs: {
    fontSize: 13,
    color: '#ff32ff'
  },
  href: {
    color: '#ffe700'
  },
  href2: {
    color: 'rgb(77, 238, 234)'
  },
  input: {
    padding: 10,
    outline: 'none',
    fontSize: 16,
    marginBottom: 10,
    border: 'none',
    borderBottom: '2px solid #ddd'
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
  cancelButton: {
    margin: '8px 0px 10px'
  },
  modal: {
    padding: '0px 25px',
    position: 'fixed',
    zIndex: 100,
    width: 400,
    height: 230,
    top: 'calc(50% - 115px)',
    left: 'calc(50% - 200px)',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column'
  },
  container: {
    padding: '0px 30px',
    border: '9px solid #ff32ff',
    height: '100vh'
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
    color: '#ff32ff',
    padding: '0px 20px 0px 0px',
    cursor: 'pointer'
  }
}

export default AppWithData