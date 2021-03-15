"use strict";
/*
 * Based from https://github.com/actions/delete-package-versions
 * Copyright (c) 2018 GitHub, Inc. and contributors
 * Licensed under MIT (https://github.com/actions/delete-package-versions/blob/main/LICENSE)
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
const defaultParams = {
    owner: '',
    repo: '',
    packageName: '',
    keepLatestPackageVersions: 10,
    token: ''
};
class Input {
    constructor(params) {
        const validatedParams = Object.assign(Object.assign({}, defaultParams), params);
        this.owner = validatedParams.owner;
        this.repo = validatedParams.repo;
        this.packageName = validatedParams.packageName;
        this.keepLatestPackageVersions = validatedParams.keepLatestPackageVersions;
        this.token = validatedParams.token;
    }
    isValidateInputParams() {
        return !!(this.owner &&
            this.repo &&
            this.packageName &&
            this.keepLatestPackageVersions > 1 &&
            this.token);
    }
}
exports.Input = Input;
