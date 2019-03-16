// eslint-disable
// this is an auto generated file. This will be overwritten
import gql from 'graphql-tag'

export const getBeatbox = `query GetBeatbox($id: ID!) {
  getBeatbox(id: $id) {
    id
    clientId
    beats
    name
  }
}
`;
export const listBeatboxs = gql`query ListBeatboxs(
  $filter: ModelBeatboxFilterInput
  $limit: Int
  $nextToken: String
) {
  listBeatboxs(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
