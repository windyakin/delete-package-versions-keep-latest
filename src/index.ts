import { getInput, setFailed } from '@actions/core';
import { context } from '@actions/github';
import { graphql } from '@octokit/graphql'
import { Input } from './input';
import {
  GetVersionsQuery,
  GetVersionsResponse,
  DeletePackageVersionsMutation,
  DeletePackageVersionResponse
} from './graphql'

(async () => {
  const input = new Input({
    owner: getInput('owner') ? getInput('owner') : context.repo.owner,
    repo: getInput('repo') ? getInput('repo') : context.repo.repo,
    packageName: getInput('package-name'),
    keepLatestPackageVersions: Number(getInput('keep-latest-package-versions')),
    token: getInput('token')
  });

  if (!input.isValidateInputParams()) {
    throw Error('invalid paramaters');
  }

  const graphqlClient = graphql.defaults({
    headers: {
      authorization: `token ${input.token}`,
      accept: 'application/vnd.github.package-deletes-preview+json'
    },
    baseUrl: process.env.GITHUB_GRAPHQL_URL
  });

  const latestVersionsResponse: GetVersionsResponse = await graphqlClient(GetVersionsQuery, {
    owner: input.owner,
    repo: input.repo,
    package: input.packageName,
    first: input.keepLatestPackageVersions,
  });

  const latestPackages = latestVersionsResponse.repository.packages.edges[0];

  if (!latestPackages) {
    throw Error(`${input.packageName} is not found`);
  }

  if (!latestPackages.node.versions.pageInfo.hasNextPage) {
    console.log(`Number of versions less than ${input.keepLatestPackageVersions}`);
    return;
  }

  const oldVersionsResponse: GetVersionsResponse = await graphqlClient(GetVersionsQuery, {
    owner: input.owner,
    repo: input.repo,
    package: input.packageName,
    first: 100,
    after: latestPackages.node.versions.pageInfo.endCursor
  });

  const oldPackages = oldVersionsResponse.repository.packages.edges[0]

  if (!oldPackages) {
    throw Error(`${input.packageName} is not found`);
  }

  const deleteVersions = oldPackages.node.versions.edges.map((item) => item.node);

  await Promise.all(deleteVersions.map(async (item: { id: string, version: string }) => {
    const response: DeletePackageVersionResponse = await graphqlClient(DeletePackageVersionsMutation, {
      packageVersionId: item.id
    });
    if (response.deletePackageVersion.success) {
      console.log(`[ Success ] ${input.packageName}:${item.version} (id: ${item.id}) is deleted`);
    } else {
      console.log(`[ Failed ] ${input.packageName}:${item.version} (id: ${item.id}) is *not* deleted`);
    }
  }));

  console.log("Finished");
})().catch((err) => {
  console.error(err);
  setFailed(err.message);
});
