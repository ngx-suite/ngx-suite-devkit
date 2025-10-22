export type AngularJSON = {
    newProjectRoot: string
    projects: {
        [projectName: string]: AngularProjectConfig
    }
}

export type AngularProjectConfig =
    & Record<string, unknown>
    &
    {
        architect: {
            build: {
                options: AngularProjectOptions
                configurations: {
                    [configurationName: string]: {
                        assets?: AngularProjectAssets[]
                        stylePreprocessorOptions?: {
                            includePaths: string[]
                        }
                    }
                }
            }
        }
    }

export type AngularProjectOptions = {
    assets: AngularProjectAssets[]
    stylePreprocessorOptions: {
        includePaths: string[]
    }

}

export type AngularProjectAssets = {
    glob: string
    input: string
    output: string
}


