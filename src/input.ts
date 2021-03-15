/*
 * Based from https://github.com/actions/delete-package-versions
 * Copyright (c) 2018 GitHub, Inc. and contributors
 * Licensed under MIT (https://github.com/actions/delete-package-versions/blob/main/LICENSE)
*/

export interface InputParams {
  owner?: string
  repo?: string
  packageName?: string
  keepLatestPackageVersions?: number
  token?: string
}

const defaultParams = {
  owner: '',
  repo: '',
  packageName: '',
  keepLatestPackageVersions: 10,
  token: ''
}

export class Input {
  owner: string
  repo: string
  packageName: string
  keepLatestPackageVersions: number
  token: string

  constructor(params?: InputParams) {
    const validatedParams: Required<InputParams> = {...defaultParams, ...params}

    this.owner = validatedParams.owner
    this.repo = validatedParams.repo
    this.packageName = validatedParams.packageName
    this.keepLatestPackageVersions = validatedParams.keepLatestPackageVersions
    this.token = validatedParams.token
  }

  isValidateInputParams(): boolean {
    return !!(
      this.owner &&
      this.repo &&
      this.packageName &&
      this.keepLatestPackageVersions > 1 &&
      this.token
    )
  }
}
