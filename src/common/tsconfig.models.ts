export type TsConfigJSON =
    & Record<string, unknown>
    &
    {
        compilerOptions: {
            paths: {
                [pathAlias: string]: [string]
            }
        }
    }
