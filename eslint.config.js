import tseslint from 'typescript-eslint'
import hooks from 'eslint-plugin-react-hooks'

export default [{
  files: ['src/**/*.{ts,tsx}', 'tests/**/*.ts'],
  languageOptions: { parser: tseslint.parser },
  plugins: { 'react-hooks': hooks },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
  },
}]
