module.exports = {
    'root': true,
    'env': {
        'browser': true,
        'node': true,
        'es6': true,
        'es2017': true
    },
    'overrides': [
        {
            'files': [
                '*.spec.ts',
                '**/testing/**/*.ts'
            ]
        },
        {
            'extends': [
                'eslint:recommended',
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
                'plugin:@angular-eslint/template/process-inline-templates',
                'plugin:import/typescript'
            ],
            'files': [
                '*.ts'
            ],
            excludedFiles: [
                '*/files/**/*'
            ],
            'parserOptions': {
                'ecmaVersion': 2020,
                'sourceType': 'module',
                'tsconfigRootDir': __dirname,
                'project': './tsconfig.json'
            },
            'plugins': [
                '@typescript-eslint',
                '@angular-eslint',
                'import',
                'unused-imports'
            ],
            'rules': {
                // ES LINT
                'no-underscore-dangle': 'off',
                'no-inner-declarations': 0,
                'max-lines': 0,
                'brace-style': [
                    'error',
                    'stroustrup'
                ],
                'curly': [
                    'error',
                    'all'
                ],
                'semi': 'off',
                'indent': [
                    'error',
                    4,
                    {
                        'SwitchCase': 1,
                        'FunctionDeclaration': {
                            'parameters': 'first'
                        }
                    }
                ],
                'id-blacklist': [
                    2,
                    'e'
                ],
                'arrow-parens': 'off',
                'no-restricted-imports': [
                    'error',
                    {
                        'paths': [
                            {
                                'name': 'rxjs/Rx',
                                'message': 'Please import directly from \'rxjs\' instead'
                            }
                        ]
                    }
                ],
                'max-classes-per-file': 'off',
                'max-len': [
                    'error',
                    {
                        'code': 140
                    }
                ],
                'no-multiple-empty-lines': 'off',
                'no-empty': 'off',
                'no-fallthrough': 'error',
                'quote-props': [
                    'error',
                    'as-needed'
                ],
                'sort-keys': 'off',
                'quotes': [
                    'error',
                    'single'
                ],
                'comma-dangle': 'off',
                'arrow-body-style': 'off',
                'object-shorthand': 'off',
                'space-before-function-paren': 'off',
                'no-unused-vars': 'off',
                'padded-blocks': [
                    'error',
                    {
                        'classes': 'always'
                    }
                ],
                // ./ES LINT

                // TYPESCRIPT
                '@typescript-eslint/no-use-before-define': [
                    'error',
                    {
                        'functions': false
                    }
                ],
                '@typescript-eslint/no-empty-function': 0,
                '@typescript-eslint/no-var-requires': 0,
                '@typescript-eslint/no-explicit-any': 0,
                '@typescript-eslint/no-unnecessary-type-assertion': 1,
                '@typescript-eslint/unbound-method': [
                    'error',
                    {
                        'ignoreStatic': true
                    }
                ],
                '@typescript-eslint/no-non-null-assertion': 0,
                '@typescript-eslint/no-namespace': 0,
                '@typescript-eslint/explicit-function-return-type': 0,
                '@typescript-eslint/semi': [
                    'error',
                    'never'
                ],
                '@typescript-eslint/array-type': 'off',
                '@typescript-eslint/member-delimiter-style': [
                    'error',
                    {
                        'multiline': {
                            'delimiter': 'none'
                        },
                        'overrides': {
                            'interface': {
                                'multiline': {
                                    'delimiter': 'none'
                                }
                            }
                        }
                    }
                ],
                '@typescript-eslint/interface-name-prefix': 'off',
                '@typescript-eslint/explicit-member-accessibility': [
                    'error',
                    {
                        'accessibility': 'no-public'
                    }
                ],
                '@typescript-eslint/member-ordering': [
                    'error',
                    {
                        'default': [
                            // Index signature
                            'signature',

                            // Fields
                            'public-static-field',
                            'protected-static-field',
                            'private-static-field',
                            'public-decorated-field',
                            'protected-decorated-field',
                            'private-decorated-field',
                            'public-instance-field',
                            'protected-instance-field',
                            'private-instance-field',
                            'public-abstract-field',
                            'protected-abstract-field',

                            // Constructors
                            'public-constructor',
                            'protected-constructor',
                            'private-constructor',

                            // Methods
                            'public-static-method',
                            'protected-static-method',
                            'private-static-method',
                            'public-decorated-method',
                            'protected-decorated-method',
                            'private-decorated-method',
                            'public-instance-method',
                            'protected-instance-method',
                            'private-instance-method',
                            'public-abstract-method',
                            'protected-abstract-method',
                        ]

                    }
                ],
                '@typescript-eslint/no-inferrable-types': [
                    'error',
                    {
                        'ignoreParameters': true
                    }
                ],
                '@typescript-eslint/comma-dangle': [
                    'error',
                    'always-multiline'
                ],
                '@typescript-eslint/no-unsafe-return': 'warn',
                '@typescript-eslint/no-unsafe-member-access': 'warn',
                '@typescript-eslint/no-unsafe-assignment': 'warn',
                '@typescript-eslint/no-unsafe-call': 'warn',
                '@typescript-eslint/no-unsafe-argument': 'warn',
                '@typescript-eslint/naming-convention': 'off',
                '@typescript-eslint/dot-notation': 'off',
                '@typescript-eslint/no-unused-vars': 'off',
                '@typescript-eslint/no-base-to-string': 'warn',
                '@typescript-eslint/no-redundant-type-constituents': 'warn',
                '@typescript-eslint/no-unsafe-enum-comparison': 'warn',
                // ./TYPESCRIPT

                // ANGULAR
                '@angular-eslint/use-component-view-encapsulation': 'error',
                '@angular-eslint/component-class-suffix': 'error',
                '@angular-eslint/contextual-lifecycle': 'error',
                '@angular-eslint/directive-class-suffix': 'error',
                '@angular-eslint/directive-selector': [
                    'error',
                    {
                        'type': 'attribute',
                        'prefix': [
                            'ns',
                            'rc',
                            'app',
                            'dev'
                        ],
                        'style': 'camelCase'
                    }
                ],
                '@angular-eslint/component-selector': [
                    'error',
                    {
                        'type': 'element',
                        'prefix': [
                            'ns',
                            'rc',
                            'app',
                            'dev'
                        ],
                        'style': 'kebab-case'
                    }
                ],
                '@angular-eslint/no-conflicting-lifecycle': 'error',
                '@angular-eslint/no-host-metadata-property': 'error',
                '@angular-eslint/no-input-rename': 'error',
                '@angular-eslint/no-inputs-metadata-property': 'error',
                '@angular-eslint/no-output-native': 'error',
                '@angular-eslint/no-output-on-prefix': 'error',
                '@angular-eslint/no-output-rename': 'error',
                '@angular-eslint/no-outputs-metadata-property': 'error',
                '@angular-eslint/use-lifecycle-interface': 'warn',
                '@angular-eslint/use-pipe-transform-interface': 'error',
                // ./ANGULAR

                // IMPORT
                'import/no-duplicates': [
                    'error'
                ],
                'import/newline-after-import': [
                    'error',
                    {
                        'count': 2
                    }
                ],
                'import/order': [
                    'error',
                    {
                        'alphabetize': {
                            'order': 'asc',
                            'caseInsensitive': true
                        },
                        'newlines-between': 'always'
                    }
                ],
                // ./IMPORT

                // UNUSED IMPORTS
                'unused-imports/no-unused-imports': 'error',
                'unused-imports/no-unused-vars': [
                    'warn',
                    {'vars': 'all', 'varsIgnorePattern': '^_', 'args': 'after-used', 'argsIgnorePattern': '^_'}
                ],
                // ./UNUSED IMPORTS

                // PREFER ARROW
                'prefer-arrow/prefer-arrow-functions': 'off'
                // ./PREFER ARROW
            }
        },
        {
            'files': [
                '*.component.html'
            ],
            'extends': [
                'plugin:@angular-eslint/template/recommended'
            ],
            'rules': {
                // ANGULAR
                '@angular-eslint/template/banana-in-box': 'error',
                '@angular-eslint/template/no-negated-async': 'error'
                // ./ANGULAR
            }
        }
    ]
};
