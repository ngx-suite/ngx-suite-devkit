import * as fs from 'fs'
import * as path from 'path'

import { Tree } from '@angular-devkit/schematics'

import { AngularProjectAssets, AngularProjectConfig } from './angular.models'
import { TsConfigJSON } from './tsconfig.models'


export namespace NsAngularEnv {

    export const EXTRA_ASSETS_SECTION_GLOB_NAME = '--EXTRA-ASSETS--'
    export const EXTRA_STYLES_SECTION_GLOB_NAME = '--EXTRA-STYLES--'

    export function toAssetsPath(entryPointRelativePath: string): string {
        return [entryPointRelativePath, 'assets'].join('/')
    }

    export function toStylesPath(entryPointRelativePath: string): string {
        return [entryPointRelativePath, 'styles'].join('/')
    }

    export function toAngularProjectAssets(entryPointRelativePath: string): AngularProjectAssets {
        return {
            glob: '**/*',
            input: toAssetsPath(entryPointRelativePath),
            output: '/assets',
        }
    }

    export function addProjectEntryPoint(
        angularProjectConfig: AngularProjectConfig,
        entryPointRelativePath: string): void {

        // assets
        if (angularProjectConfig?.architect?.build?.options?.assets) {
            addAssetsIfNotExists(angularProjectConfig.architect.build.options.assets, entryPointRelativePath)
        }
        // styles
        if (angularProjectConfig?.architect?.build?.options?.stylePreprocessorOptions?.includePaths) {
            addStylesIfNotExists(angularProjectConfig.architect.build.options.stylePreprocessorOptions.includePaths, entryPointRelativePath)
        }
        // configurations
        const allConfigurations = angularProjectConfig.architect.build.configurations
        Object.keys(allConfigurations)
            .forEach(configurationName => {
                // assets
                if (allConfigurations[configurationName].assets) {
                    addAssetsIfNotExists(allConfigurations[configurationName].assets, entryPointRelativePath)
                }
                // styles
                if (allConfigurations[configurationName].stylePreprocessorOptions?.includePaths) {
                    addStylesIfNotExists(allConfigurations[configurationName].stylePreprocessorOptions.includePaths, entryPointRelativePath)
                }
            })
    }

    export function cleanProjectAssetsAndStyles(angularProjectConfig: AngularProjectConfig): void {

        // assets
        if (angularProjectConfig?.architect?.build?.options?.assets) {
            angularProjectConfig.architect.build.options.assets = removeExtraAssets(angularProjectConfig.architect.build.options.assets)
        }
        // styles
        if (angularProjectConfig?.architect?.build?.options?.stylePreprocessorOptions?.includePaths) {
            angularProjectConfig.architect.build.options.stylePreprocessorOptions.includePaths =
                removeExtraStyles(angularProjectConfig.architect.build.options.stylePreprocessorOptions.includePaths)
        }
        // configurations
        const allConfigurations = angularProjectConfig.architect.build.configurations
        Object.keys(allConfigurations)
            .forEach(configurationName => {
                // assets
                if (allConfigurations[configurationName].assets) {
                    allConfigurations[configurationName].assets = removeExtraAssets(allConfigurations[configurationName].assets)
                }
                // styles
                if (allConfigurations[configurationName].stylePreprocessorOptions?.includePaths) {
                    allConfigurations[configurationName].stylePreprocessorOptions.includePaths =
                        removeExtraStyles(allConfigurations[configurationName].stylePreprocessorOptions.includePaths)
                }
            })
    }

    export function addAssetsIfNotExists(allAssets: AngularProjectAssets[], entryPointRelativePath: string): void {
        const entryPointAssets = toAngularProjectAssets(entryPointRelativePath)
        const refAssetsRecordIndex = allAssets.findIndex(item => item.input === entryPointAssets.input)
        if (refAssetsRecordIndex === -1) {
            allAssets.push(entryPointAssets)
        }
        // do nothing
    }

    export function addStylesIfNotExists(stylesIncludePaths: string[], entryPointRelativePath: string): void {
        const entryPointStylesPath = toStylesPath(entryPointRelativePath)
        const refStylesRecordIndex = stylesIncludePaths.findIndex(item => item === entryPointStylesPath)
        if (refStylesRecordIndex === -1) {
            stylesIncludePaths.push(entryPointStylesPath)
        }
    }

    export function removeExtraAssets(allAssets: AngularProjectAssets[]): AngularProjectAssets[] {
        const extraAssetsStartsIndex = allAssets.findIndex(item => item.glob === EXTRA_ASSETS_SECTION_GLOB_NAME)
        // remove all if there is no section placeholder
        if (extraAssetsStartsIndex < 0) {
            return []
        }
        return allAssets.slice(0, extraAssetsStartsIndex + 1)
    }

    export function removeExtraStyles(stylesIncludePaths: string[]): string[] {
        const extraStylesStartsIndex = stylesIncludePaths.findIndex(item => item === EXTRA_STYLES_SECTION_GLOB_NAME)
        // remove all if there is no section placeholder
        if (extraStylesStartsIndex < 0) {
            return []
        }
        return stylesIncludePaths.slice(0, extraStylesStartsIndex + 1)
    }

    export function libNameToPath(alias: string, rootDirPath: string): string {
        const result = path.join(rootDirPath, alias)

        if (fs.existsSync(path.join(result, 'main'))) {
            return path.join(result, 'main')
        }
        return path.join(result)
    }

    export type EntryPointInfo = {
        alias: string
        relativePath: string
    }

    export const MAIN_ENTRY_POINT_DIR_NAME = 'main'

    export function scanLibEntryPoints(angularRootDirPath: string, libDirPath: string, parentAlias?: string): EntryPointInfo[] {
        const result: EntryPointInfo[] = []
        try {
            // Get the files as an array
            const files = fs.readdirSync(libDirPath)
            // Loop throw all directories
            for (const directoryName of files) {
                // Get the full paths
                const currentDirPath = path.join(libDirPath, directoryName)

                if (!fs.lstatSync(currentDirPath).isDirectory()) {
                    continue
                }

                if (!parentAlias?.length) {
                    result.push(
                        ...scanLibEntryPoints(angularRootDirPath, currentDirPath, directoryName),
                    )
                    continue
                }

                // src directory
                if (directoryName === 'src') {
                    result.push({
                        alias: parentAlias,
                        relativePath: path.relative(angularRootDirPath, path.join(libDirPath)).split(`${'\\'}`).join('/'),
                    })
                } // main directory
                else if (directoryName === MAIN_ENTRY_POINT_DIR_NAME) {
                    result.push({
                        alias: parentAlias,
                        relativePath: path.relative(angularRootDirPath, path.join(libDirPath, directoryName)).split(`${'\\'}`).join('/'),
                    })
                } // secondary entry point
                else  {
                    result.push(
                        ...scanLibEntryPoints(angularRootDirPath, currentDirPath, toEntryPointAlias(parentAlias, directoryName)),
                    )
                }
            }
        }
        catch (error) {
            console.error('Whoops! Something happen :(', error)
        }

        return result
    }

    export function toEntryPointAlias(...aliasPath: string[]): string {
        return aliasPath.join('/')
    }

    export function addTsConfigPathIfNotExists(tsConfig: TsConfigJSON, entryPointInfo: EntryPointInfo): void {
        if (!tsConfig.compilerOptions.paths[entryPointInfo.alias]) {
            if (!tsConfig.compilerOptions.paths) {
                tsConfig.compilerOptions.paths = {}
            }
            const relativePath = [entryPointInfo.relativePath, 'src', 'public-api'].join('/')
            tsConfig.compilerOptions.paths[entryPointInfo.alias] = [relativePath]
        }
    }


    export function ngxScanLibEntryPoints(host: Tree, libDirPath: string, parentAlias?: string): EntryPointInfo[] {
        const result: EntryPointInfo[] = []
        try {
            // Get the files as an array
            const dirEntry = host.getDir(libDirPath)
            // Loop throw all directories
            for (const directoryName of dirEntry.subdirs) {
                // Get the full paths
                const currentDirPath = path.join(libDirPath, directoryName).split(`${'\\'}`).join('/')

                if (!parentAlias?.length) {
                    result.push(
                        ...ngxScanLibEntryPoints(host, currentDirPath, directoryName),
                    )
                    continue
                }

                // src directory
                if (directoryName === 'src') {
                    result.push({
                        alias: parentAlias,
                        relativePath: libDirPath,
                    })
                } // main directory
                else if (directoryName === MAIN_ENTRY_POINT_DIR_NAME) {
                    result.push({
                        alias: parentAlias,
                        relativePath: path.join(libDirPath, directoryName).split(`${'\\'}`).join('/'),
                    })
                } // secondary entry point
                else  {
                    result.push(
                        ...ngxScanLibEntryPoints(host, currentDirPath, toEntryPointAlias(parentAlias, directoryName)),
                    )
                }
            }
        }
        catch (error) {
            console.error('Whoops! Something happen :(', error)
        }

        return result
    }

}
