module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb-typescript',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        'react',
        '@typescript-eslint',
    ],
    rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
        'react/jsx-indent': ['error', 4],
        'import/extensions': ['error', {
            ts: 'never',
            tsx: 'never',
        }],
        indent: [
            'error', 4,
        ],
    },
    settings: {
        'import/resolver': {
            typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
        },
    },
};
