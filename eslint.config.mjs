import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	// Override default ignores of eslint-config-next.
	globalIgnores([
		// Default ignores of eslint-config-next:
		'.next/**',
		'.vercel/**',
		'out/**',
		'build/**',
		'next-env.d.ts',
	]),
	{
		rules: {
			// Import sorting
			'import/order': [
				'warn',
				{
					groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
					'newlines-between': 'ignore',
				},
			],

			// Light hygiene (optional but nice)
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'no-debugger': 'warn',
			eqeqeq: ['error', 'smart'],
			'prefer-const': 'error',
			'object-shorthand': 'error',

			// TS specifics (applied where TS parser is active)
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{ prefer: 'type-imports', fixStyle: 'inline-type-imports' },
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/member-ordering': [
				'warn',
				{
					interfaces: {
						memberTypes: ['field', 'method'],
						order: 'alphabetically',
					},
				},
			],
		},
	},
]);

export default eslintConfig;
