import * as path from 'path'

import { normalize, strings } from '@angular-devkit/core'
import { apply, mergeWith, move, Rule, SchematicContext, template, Tree, url } from '@angular-devkit/schematics'
import { AngularJSON, NsAngularEnv, TsConfigJSON } from '@ngx-suite/devkit'

import { Schema } from './schema'


export function newEntryPoint(options: Schema): Rule {
    return (host: Tree, context: SchematicContext) => {
        // validate
        if (options.basePath.startsWith('/') || options.basePath.startsWith('\\')
            || options.basePath.endsWith('/') || options.basePath.endsWith('\\') || options.basePath.startsWith('projects')) {
            throw new Error(`Invalid library name ${options.basePath}`)
        }

        const angularJsonPath = 'angular.json'
        const currentAngularJson = host.read(angularJsonPath).toString('utf-8')
        const angularJson = JSON.parse(currentAngularJson) as AngularJSON

        const libNameArr = options.basePath.split('/')
        const libAlias = options.basePath.endsWith('/main') ? libNameArr.slice(0, libNameArr.length - 1).join('/') : options.basePath
        const libPath = path.join(angularJson.newProjectRoot, options.basePath)

        // Update angular.json
        const projectName = options.projectName ?? Object.keys(angularJson.projects)[0]
        const angularProjectConfig = angularJson.projects[projectName]

        if (angularProjectConfig) {
            NsAngularEnv.addProjectEntryPoint(angularJson.projects[projectName], libPath.split(`${'\\'}`).join('/'))
            host.overwrite(angularJsonPath, JSON.stringify(angularJson, null, 4))
        }
        else {
            context.logger.warn(`Project "${projectName}" is not defined in the angular.json`)
        }

        // Update tsconfig.json
        const tsConfigJsonPath = 'tsconfig.json'
        const tsConfigJson = host.read(tsConfigJsonPath).toString('utf-8')
        const tsConfig = JSON.parse(tsConfigJson) as TsConfigJSON

        let tsConfigAlias = libAlias

        if (options?.tsPathFragmentAliases?.length) {
            const tsPathFragmentAliasesArr = options?.tsPathFragmentAliases.split(',')
            for (let i = 0; i <= tsPathFragmentAliasesArr.length / 2; i+=2) {
                tsConfigAlias = tsConfigAlias.replace(tsPathFragmentAliasesArr[i], tsPathFragmentAliasesArr[i + 1])
            }
        }

        const entryPointInfo: NsAngularEnv.EntryPointInfo = {
            alias: tsConfigAlias,
            relativePath: libPath.split(`${'\\'}`).join('/'),
        }

        NsAngularEnv.addTsConfigPathIfNotExists(tsConfig, entryPointInfo)
        host.overwrite(tsConfigJsonPath, JSON.stringify(tsConfig, null, 4))

        const templateSource = apply(url('./files'), [
            template({
                classify: strings.classify,
                dasherize: strings.dasherize,
                assetsDirName: libAlias.split('/').join('.'),
                stylesDirName: libAlias.split('/').join('.'),
            }),
            move(normalize(libPath)),
        ])

        return mergeWith(templateSource)(host, context) as Tree
    }
}
