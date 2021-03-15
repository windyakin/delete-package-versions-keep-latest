export const GetVersionsQuery = `
  query ($owner: String!, $repo: String!, $package: String!, $first: Int = 10, $after: String) {
    repository(owner: $owner, name: $repo) {
      packages(first: 1, names: [$package]) {
        edges {
          node {
            name
            versions(first: $first, after: $after, orderBy: { direction: DESC, field: CREATED_AT }) {
              pageInfo {
                endCursor
                hasNextPage
              }
              edges {
                node {
                  id
                  version
                }
              }
            }
          }
        }
      }
    }
  }
`

export interface GetVersionsResponse {
  repository: {
    packages: {
      edges: {
        node: {
          name: string
          versions: {
            pageInfo: {
              endCursor: string,
              hasNextPage: boolean
            },
            edges: {
              node: {
                id: string,
                version: string
              }
            }[]
          }
        }
      }[]
    }
  }
}

export const DeletePackageVersionsMutation = `
  mutation ($packageVersionId: String!) {
    deletePackageVersion(input: {
      packageVersionId: $packageVersionId
    }) {
      success
    }
  }
`

export interface DeletePackageVersionResponse {
  deletePackageVersion: {
    success: boolean
  }
}
