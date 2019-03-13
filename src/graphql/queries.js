// eslint-disable
// this is an auto generated file. This will be overwritten

export const getBeatbox = `query GetBeatbox($id: ID!) {
  getBeatbox(id: $id) {
    id
    clientId
    beats
  }
}
`;
export const listBeatboxs = `query ListBeatboxs(
  $filter: ModelBeatboxFilterInput
  $limit: Int
  $nextToken: String
) {
  listBeatboxs(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      clientId
      beats
    }
    nextToken
  }
}
`;
