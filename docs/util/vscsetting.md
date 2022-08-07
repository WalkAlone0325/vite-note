
# VsCode 常用设置和插件相关

## 常用设置

```json
{
  "editor.inlineSuggest.enabled": true,
  "workbench.colorTheme": "GitHub Dark",
  "workbench.iconTheme": "material-icon-theme",
  "editor.fontSize": 14,
  "files.autoSave": "onFocusChange",
  "editor.tabSize": 2,
  "merge-conflict.autoNavigateNextConflict.enabled": true,
  "editor.experimental.stickyScroll.enabled": true,
  "github.copilot.enable": {
    "*": true,
    "yaml": false,
    "plaintext": false,
    "markdown": false
  },
  "editor.formatOnSave": true,

  // volar
  "volar.autoCompleteRefs": true,
  "volar.codeLens.references": false,

  // eslint
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ],

  "svg.preview.mode": "svg",

  // prettier
  "prettier.singleQuote": true,
  "prettier.trailingComma": "none",
  "prettier.semi": false,
  "prettier.bracketSpacing": true,

  "[css]": {
    "editor.defaultFormatter": "stylelint.vscode-stylelint"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "yzhang.markdown-all-in-one"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[vue]": {
    "editor.defaultFormatter": "Vue.volar"
  },
  "[less]": {
    "editor.defaultFormatter": "vscode.css-language-features"
  }
}
```

## 常用插件

1. Auto Close Tag
2. Auto Import
3. Better Comments
4. DotEnv
5. EditorConfig for VS Code
6. ES7+ React/Redux
7. Eslint
8. Git Graph
9. Github Copliot
10. GitHub Theme
11. GitLens
12. Import Cost
13. Javascript(ES6) code snippets
14. Markdown All in One 
15. Material Icon Theme
16. npm intellisense
17. Prettier
18. Project Manager
19. StyleLint
20. SVG
21. Typescript Vue Plugin(Volar)
22. Vue Language Features (Volar)