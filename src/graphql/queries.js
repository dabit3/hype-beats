// eslint-disable
// this is an auto generated file. This will be overwritten
import gql from 'graphql-tag'

export const getDrumMachine = `query GetDrumMachine($id: ID!) {
  getDrumMachine(id: $id) {
    id
    clientId
    beats
    name
  }
}
`;
export const listDrumMachines = gql`query ListDrumMachines {
  listDrumMachines(limit: 500) {
    items {
      id
      clientId
      beats
      name
    }
    nextToken
  }
}
`;
