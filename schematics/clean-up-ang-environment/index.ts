import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics'
import { AngularJSON, NsAngularEnv } from '@ngx-suite/devkit'

import { OptionsSchema } from './schema'


export function cleanUpAngularEnvironment(options: OptionsSchema): Rule {
    return (host: Tree, context: SchematicContext) => {

        const angularJsonPath = 'angular.json'
        const currentAngularJson = host.read(angularJsonPath).toString('utf-8')
        const angularJson = JSON.parse(currentAngularJson) as AngularJSON

        const projectName = options.projectName ?? Object.keys(angularJson.projects)[0]
        const angularProjectConfig = angularJson.projects[projectName]

        if (!angularProjectConfig) {
            throw Error(`Project "${projectName}" is not defined in the angular.json`)
        }

        context.logger.info('Cleaning up ...\n')

        NsAngularEnv.cleanProjectAssetsAndStyles(angularProjectConfig)

        context.logger.info('Write changes ...\n')
        // save changes
        host.overwrite(angularJsonPath, JSON.stringify(angularJson, null, 4))
        context.logger.info('Project clean up is finished!\n')

        return host
    }

}
