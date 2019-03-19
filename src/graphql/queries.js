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
export const listDrumMachines = gql`query ListDrumMachines(
  $filter: ModelDrumMachineFilterInput
  $limit: Int
  $nextToken: String
) {
  listDrumMachines(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
