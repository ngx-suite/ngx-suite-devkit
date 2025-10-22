# Ngx Suite Devkit :: Schematics

## Development Guide

- `npm i`
- `npm run init-devkit` will build ngx-suite-devkit and link dist dir to deps => now `@ngx-suite/devkit` alias is available is schematics

### Schematics development

- make changes to schematics
- `npm run build-schematics` will build schematics => now the schematics is a part of linked `@ngx-suite/devkit` lib, and you can test with CLI


---

## Generate New Entry Point

`ng g @ngx-suite/devkit:new-entry-point --base-path=<ENTRY_POINT_BASE_PATH> --project-name=<PROJECT_NAME>`



| Argument | Description                                                                                                                                                                                               | Required |   Default value   |
|---------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------:|:-----------------:|
| `base-path`     | The entry point base path relative to angular.json `newProjectRoot`. Example: `app-shared/new-feature`                                                                                                    | **YES**  |         -         |
| `project-name`  | The reference project name from angular.json. By default the first project in the list will be used.                                                                                                      |   NO     | The first project |
| `ts-path-fragment-aliases`  | Comma separated base path fragment aliases. Example: --base-path=ngx-suite-common/some/endpoint --ts-path-fragment-aliases=ngx-suite-,@ngx-suite/ => tsconfig path alias will be @ngx-suite/common/some/endpoint |   NO     |         -         |

#### Description

A new entry point will be created:
 
- entry point directory will be populated with boilerplate code/files `<ENTRY_POINT_BASE_PATH>/{src,styles,assets}`
- `angular.json` build options will be extended (assets/stylePreprocessorOptions)
- new alias will be added to `tsconfig.json` paths collection

#### Examples:

- Generate Main entry point:
    - `ng g @ngx-suite/devkit:new-entry-point --base-path=app-shared/new-feature/main`
        - new entry point base path `projects/app-shared/new-feature/main` (relative to Angular Root dir)
        - entry point will be populated with boilerplate code/files `projects/app-shared/new-feature/main/{src,styles,assets}`


- Generate Secondary entry point:
    - `ng g @ngx-suite/devkit:new-entry-point --base-path=app-shared/new-feature/secondary`
        - new entry point base path `projects/app-shared/new-feature/secondary` (relative to Angular Root dir)
        - entry point will be populated with boilerplate code/files `projects/app-shared/new-feature/secondary/{src,styles,assets}`

## Synchronize Angular Environment


`ng g @ngx-suite/devkit:sync-ang-env --source-dir-path=<SOURCE_DIR_PATH> --project-name=<PROJECT_NAME> --parent-lib-alias=<PARENT_LIB_ALIAS>`


| Argument | Description                                                                                                                                                                                                                                                                              | Required |   Default value   |
|---------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------:|:-----------------:|
| `source-dir-path`     | The entry point base path relative to angular root directory. Example: `projects`, `projects/ngx-suite-common`                                                                                                                                                                                 |    NO    |    `projects`     |
| `project-name`  | The reference project name from angular.json. By default the first project in the list will be used.                                                                                                                                                                                     |    NO    | The first project |
| `parent-lib-alias`  | The alias prefix of the current libraray. The scanning start from the any level, for example: <br/> we want to scan all entry point under `projects/ngx-suite-common/shared` => `@ngx-suite/devkit:sync-ang-environment --source-dir-path=projects/ngx-suite-common/shared --parent-lib-alias=ngx-suite-common/shared` |    NO    |         -         |

#### Description

The relevant `SOURCE_DIR` will be scanned for entry points and environment settings will be synchronized with the current state:

 - `angular.json` build options will be extended (assets/stylePreprocessorOptions)
 - not existed entry points aliases will be added to `tsconfig.json` paths collection

#### Examples

- Scan all libraries for the "regular" app with default setup:
    - `ng g @ngx-suite/devkit:sync-ang-env`


- Scan all libraries for ngx-suite-common application:
    - `ng g @ngx-suite/devkit:new-entry-point --source-dir-path=projects/applications/app/projects --project-name=app`


## Clean Up the Angular Environment


`ng g @ngx-suite/devkit:clean-up-ang-env --project-name=<PROJECT_NAME>`


| Argument | Description                                                                                                                                                                                                                                                                             | Required | Default value |
|---------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------:|:-------------:|
| `project-name`  | The reference project name from angular.json.                                                                                                                                                                                                                                           |   YES    |       -       |

#### Description

The script will remove all extra assets and stylePreprocessorOptions records from `angular,json` for a specific project and all it's configurations.

- Extra assets are defined with glob alias `--EXTRA-ASSETS--`, like so:
```
{
    "glob": "--EXTRA-ASSETS--",
    "input": "/",
    "output": "/"
},
.... Everything below are extra assets that will be removed
```
- Extra stylePreprocessorOptions are defined with alias `--EXTRA-STYLES--`, like so:
```
"includePaths": [
    ".",
    "projects/ngx-suite-common/main/styles",
    "projects/ngx-suite-common/main/styles/common-globals",
    "--EXTRA-STYLES--",
    ... Everything below are extra styles that will be removed
```

#### Examples

- Clean up assets and styles for some project: `ng g @ngx-suite/devkit:clean-up-ang-env --project-name=app`
