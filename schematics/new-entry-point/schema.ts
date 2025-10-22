export type Schema = {
    basePath: string
    projectName?: string // if not specified the first project in the list will be used
    tsPathFragmentAliases?: string // will be used for tsconfig path decoration
}
