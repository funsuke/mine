module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "es6": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": ["tsconfig.json", "tsconfig.jest.json"],
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
    "import"
  ],
  "ignorePatterns": [
    "**/*.js"
  ],
  "rules": {
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "default",
        "format": ["camelCase"],
        "leadingUnderscore": "allow"
      },
      {
        "selector": "class",
        "format": ["PascalCase"]
      },
      {
        "selector": "interface",
        "format": ["PascalCase"]
      },
      {
        "selector": "typeAlias",
        "format": ["PascalCase"]
      },
      {
        "selector": "property",
        "format": null
      },
			// add 20240310 funsuke
			{
				"selector": "variable",
				"types": ["const"],
				"format": ["UPPER_CASE", "PascalCase"]
			},
    ],
    "@typescript-eslint/indent": [
      "error",
      "tab",
      {
        "FunctionDeclaration": {
          "parameters": "first"
        },
        "FunctionExpression": {
          "parameters": "first"
        },
        "SwitchCase": 1,
        "flatTernaryExpressions": true,
        "ignoredNodes": ["ConditionalExpression"]
      }
    ],
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        "multiline": {
          "delimiter": "semi",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "semi",
          "requireLast": false
        },
        "overrides": {
          "interface": {
            "singleline": {
              "delimiter": "semi",
              "requireLast": true
            },
            "multiline": {
              "delimiter": "semi",
              "requireLast": true
            }
          }
        }
      }
    ],
    "@typescript-eslint/member-ordering": ["error",
      {
        "default": [
          "public-static-field",
          "public-instance-field",
          "private-instance-field",
          "public-static-method",
          "public-constructor",
          "public-instance-method",
          "private-instance-method"
        ]
      }
    ],
    "@typescript-eslint/no-empty-function": "error",
    "@typescript-eslint/no-parameter-properties": "error",
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/quotes": [
      "error",
      "double"
    ],
    "@typescript-eslint/semi": [
      "error"
    ],
    "@typescript-eslint/type-annotation-spacing": "error",
    "@typescript-eslint/typedef": ["error", {
      "propertyDeclaration": true,
      "memberVariableDeclaration": false,
      "parameter": true,
      "arrowParameter": false
    }],
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true,
      "allowTypedFunctionExpressions": true
    }],
    "@typescript-eslint/no-unused-vars": ["error", {
      "vars": "all",
      "args": "none",
      "argsIgnorePattern": "^_"
    }],
    "camelcase": "off",
    "curly": "off",
    "dot-notation": "error",
    "eol-last": "error",
    "eqeqeq": [
      "error",
      "smart"
    ],
    "guard-for-in": "error",
    "id-blacklist": "off",
    "id-match": "off",
    "max-len": [
      "error",
      {
        "code": 140
      }
    ],
    "no-bitwise": "off",
    "no-caller": "error",
    "no-console": [
      "error",
      {
        "allow": [
          "log",
          "warn",
          "dir",
          "timeLog",
          "assert",
          "clear",
          "count",
          "countReset",
          "group",
          "groupEnd",
          "table",
          "dirxml",
          "error",
          "groupCollapsed",
          "Console",
          "profile",
          "profileEnd",
          "timeStamp",
          "context"
        ]
      }
    ],
    "no-debugger": "error",
    "no-empty": "error",
    "no-eval": "error",
    "no-fallthrough": "error",
    "no-new-wrappers": "error",
    "no-redeclare": "off",
    "no-trailing-spaces": "error",
    "comma-spacing": "error",
    "brace-style": "error",
    "no-underscore-dangle": "off",
    "no-unused-expressions": "error",
    "no-unused-labels": "error",
    "radix": "error",
    "spaced-comment": ["error", "always", { "markers": ["/"] }],
    "keyword-spacing": ["error"],
    "import/order": ["error", {
      "alphabetize": {
        "order": "asc",
        "caseInsensitive": true
      }
    }]
  }
}
