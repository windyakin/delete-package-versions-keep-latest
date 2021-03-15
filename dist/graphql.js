"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePackageVersionsMutation = exports.GetVersionsQuery = void 0;
exports.GetVersionsQuery = `
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
`;
exports.DeletePackageVersionsMutation = `
  mutation ($packageVersionId: String!) {
    deletePackageVersion(input: {
      packageVersionId: $packageVersionId
    }) {
      success
    }
  }
`;
