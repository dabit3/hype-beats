import React, { useReducer, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Tone from 'tone';

import useBPM from './useBPM';
import useStart from './useStart';
import StepContext from './StepContext';
import Transport from './Transport';
import StepSequencer from './StepSequencer';
import Fx from './FX';

import { API, graphqlOperation } from 'aws-amplify'
import { createBeatbox as CreateBeatbox, updateBeatbox as UpdateBeatbox } from './graphql/mutations'
import { onUpdateBeatbox } from './graphql/subscriptions'
import uuid from 'uuid/v4'

const clientId = uuid()

const Container = styled.div`
  max-width: 800px;
  margin: auto;
  background: linear-gradient(to bottom right, #222, #0a0a0a);
  border: 2px solid black;
  border-radius: 4px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  flex: 1;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  padding: 0px 20px 10px;
  display: flex;
`;

const Logo = styled.h1`
  font-size: 28px;
  color: #25ccf7;
  font-family: 'Righteous', cursive;
  padding: 20px;
  margin: 0;
  text-transform: uppercase;
  display: inline-block;
`;

const config = {
  tracks: ['Kick', 'Sub1', 'Sub2', 'Snare', 'Clap', 'HiHat', 'OpenHiHat'],
  samples: {
    Kick: 'sounds/kick.wav',
    Sub1: 'sounds/bass.wav',
    Sub2: 'sounds/sub.wav',
    Snare: 'sounds/snare.wav',
    Clap: 'sounds/clap.wav',
    HiHat: 'sounds/hat2.wav',
    OpenHiHat: 'sounds/openhihat.wav',
  },
};

const initialStepState = {
  Kick: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  Sub1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  Sub2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  Snare: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  Clap: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  HiHat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  OpenHiHat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
}

async function updateBeatbox(beats, machineId) {
  console.log('beats:', beats)
  const beatbox = {
    id: machineId, clientId, beats: JSON.stringify(beats)
  }
  try {
    await API.graphql(graphqlOperation(UpdateBeatbox, { input: beatbox }))
    console.log('successfully updated beatbox...')
  } catch (err) {
    console.log('error updating beatbox...:', err)
  }
  return () => {}
}

async function createBeatbox(beatbox, setSteps) {
  try {
    await API.graphql(graphqlOperation(CreateBeatbox, { input: beatbox }))
    console.log('successfully created beatbox!')
  } catch (err) {
    console.log('error creating beatbox...: ', err)
    const { errors } = err
    const beats = errors[0].data.beats
    setSteps(JSON.parse(beats))
  }
}

function reducer(state, action) {
  return action
}

export default function DrumMachine(props) {
  const { name: machineName, id: machineId } = props.match.params

  const [stepState, setSteps] = useReducer(reducer, initialStepState)
  const [buffers, setBuffers] = useState({});
  const [currentStep, setCurrentStepState] = useState(0);

  const [start, startButton] = useStart();
  const [bpm, bpmSelector] = useBPM(65);

  const buffersRef = useRef(buffers);
  buffersRef.current = buffers;
  const stepsRef = useRef(stepState);
  stepsRef.current = stepState;
  const currentStepRef = useRef(currentStep);
  currentStepRef.current = currentStep;
  
  useEffect( () => {
    const beatbox = {
      id: machineId,
      clientId,
      beats: JSON.stringify(stepState),
      name: machineName
    }
    createBeatbox(beatbox, setSteps)
  }, [])

  useEffect(() => {
    const subscriber = API.graphql(graphqlOperation(onUpdateBeatbox)).subscribe({
      next: data => {
        const { value: { data: { onUpdateBeatbox: { clientId: ClientId, beats }}}} = data
        if (ClientId === clientId) return
        setSteps(JSON.parse(beats))
      }
    });
    return () => subscriber.unsubscribe()
  }, []);

  useEffect(
    () => {
      Tone.Transport.scheduleRepeat(function(time) {
        Object.keys(buffersRef.current).forEach(b => {
          let targetStep = stepsRef.current[b][currentStepRef.current];
          let targetBuffer = buffersRef.current[b];

          if (targetStep === 1) {
            targetBuffer.start(time);
          } else if (targetStep === 2) {
            targetBuffer.start();
            targetBuffer.start('+64n');
            targetBuffer.start('+32n');
          }
        });

        setCurrentStepState(step => {
          return step > 14 ? 0 : step + 1;
        });
      }, '16n');
    },
    [config]
  );

  useEffect(
    () => {
      Tone.Transport.bpm.value = bpm;
    },
    [bpm]
  );

  useEffect(
    () => {
      if (start) {
        Tone.Transport.start();
      } else {
        Tone.Transport.stop();
        setCurrentStepState(0);
      }
    },
    [start]
  );

  return (
    <StepContext.Provider value={{ state: stepState, setSteps, updateBeatbox, machineId }}>
      <Container>
        <Transport>
          <Logo>{machineName}</Logo>
          {bpmSelector}
          {startButton}
        </Transport>
        <React.Suspense fallback={<p>loading</p>}>
          <StepSequencer
            config={config}
            currentStep={currentStepRef.current}
            playing={start}
            setBuffers={setBuffers}
          />
          <ButtonContainer>
            <Fx sound="sounds/loop.wav" title="Turn Up (F)" />
            <Fx sound="sounds/loop130.wav" title="SQUAD (Am)" />
            <Fx sound="sounds/hey.wav" title="Hey" />
            <Fx sound="sounds/yeah.wav" title="Yeah" />
          </ButtonContainer>
        </React.Suspense>
      </Container>
    </StepContext.Provider>
  );
}
