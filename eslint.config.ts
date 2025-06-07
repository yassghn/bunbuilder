/**
 * eslint.config.ts
 */

import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    globalIgnores([]),
	{
        files: ['make.ts', 'src/**/*.ts'],
        ignores: [],
		rules: {
			semi: 'error',
			'prefer-const': 'error'
		}
	}
])