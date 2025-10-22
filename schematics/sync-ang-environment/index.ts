import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics'
import { AngularJSON, NsAngularEnv, TsConfigJSON } from '@ngx-suite/devkit'


import { OptionsSchema } from './schema'


export function syncAngularEnvironment(options: OptionsSchema): Rule {
    return (host: Tree, context: SchematicContext) => {

        if (!(host.getDir(options.sourceDirPath).subdirs)?.length) {
            throw Error(`target-lib-dir-path does not exist: ${options.sourceDirPath}`)
        }

        const entryPoints = NsAngularEnv.ngxScanLibEntryPoints(
            host,
            options.sourceDirPath,
            options.parentLibAlias,
        )

        if (!entryPoints.length) {
            context.logger.info('No Entry points found => nothing to do ...\n')
            return
        }

        context.logger.info(`Totally ${entryPoints.length} entry points were found.\n`)

        const angularJsonPath = 'angular.json'
        const currentAngularJson = host.read(angularJsonPath).toString('utf-8')
        const angularJson = JSON.parse(currentAngularJson) as AngularJSON

        const tsConfigJsonPath = 'tsconfig.json'
        const tsConfigJson = host.read(tsConfigJsonPath).toString('utf-8')
        const tsConfig = JSON.parse(tsConfigJson) as TsConfigJSON

        const projectName = options.projectName ?? Object.keys(angularJson.projects)[0]
        const angularProjectConfig = angularJson.projects[projectName]

        if (!angularProjectConfig) {
            throw Error(`Project "${projectName}" is not defined in the angular.json`)
        }

        context.logger.info('Start Entry Points sync ...\n')

        entryPoints.forEach(entryPointInfo => {
            context.logger.info(`${entryPointInfo.alias} ...`)
            // Angular JSON
            NsAngularEnv.addProjectEntryPoint(angularProjectConfig, entryPointInfo.relativePath)
            // TsConfig
            NsAngularEnv.addTsConfigPathIfNotExists(tsConfig, entryPointInfo)
        })

        context.logger.info('\nWrite changes ...\n')
        // save changes
        host.overwrite(angularJsonPath, JSON.stringify(angularJson, null, 4))
        host.overwrite(tsConfigJsonPath, JSON.stringify(tsConfig, null, 4))
        context.logger.info('Environment Sync is Finished!\n')

        return host
    }

}
