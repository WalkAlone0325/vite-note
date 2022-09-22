
# VsCode 常用设置和插件相关

## 常用设置 （基础配置）

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


## 全量配置

```json
{
  // window
  "window.autoDetectColorScheme": true, // auto change theme
  "window.dialogStyle": "custom",
  "window.titleBarStyle": "custom",
  // "window.nativeTabs": true, // this is great, macOS only

  // files
  "files.autoSave": "onWindowChange",
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.simpleDialog.enable": true,

  // git
  "git.autofetch": true,
  // "git.confirmSync": false,
  // "git.enableSmartCommit": true,
  "git.untrackedChanges": "separate",
  "merge-conflict.autoNavigateNextConflict.enabled": true,
  "github.copilot.enable": {
    "*": true,
    "yaml": false,
    "plaintext": true,
    "markdown": true
  },

  // workbench
  "workbench.colorTheme": "GitHub Light",
  "workbench.preferredDarkColorTheme": "GitHub Dark",
  "workbench.preferredLightColorTheme": "GitHub Light",
  // "workbench.fontAliasing": "antialiased",
  "workbench.iconTheme": "material-icon-theme",
  "workbench.editor.closeOnFileDelete": true,
  "workbench.editor.highlightModifiedTabs": true,
  "workbench.editor.tabCloseButton": "left",
  "workbench.editor.limit.enabled": true,
  "workbench.editor.limit.perEditorGroup": true,
  "workbench.editor.limit.value": 5,
  "workbench.list.smoothScrolling": true,
  "workbench.sideBar.location": "right",
  "workbench.tree.expandMode": "singleClick",
  "workbench.tree.indent": 10,

  "extensions.autoUpdate": "onlyEnabledExtensions",
  "extensions.ignoreRecommendations": true,

  "explorer.confirmDelete": false,
  "explorer.confirmDragAndDrop": false,

  //terminal
  "terminal.integrated.smoothScrolling": true,
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.cursorBlinking": true,
  "terminal.integrated.cursorStyle": "line",
  "terminal.integrated.fontWeight": "300",
  "terminal.integrated.persistentSessionReviveProcess": "never",
  "terminal.integrated.tabs.enabled": true,

  "scm.diffDecorationsGutterWidth": 2,
  "debug.onTaskErrors": "debugAnyway",
  "diffEditor.ignoreTrimWhitespace": false,

  // editor
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.formatOnSave": true, // 自动保存
  "editor.formatOnPaste": true,
  "editor.stickyScroll.enabled": true,
  "editor.accessibilitySupport": "off",
  "editor.cursorSmoothCaretAnimation": true,
  "editor.find.addExtraSpaceOnTop": false,
  "editor.guides.bracketPairs": "active",
  "editor.inlineSuggest.enabled": true,
  "editor.lineNumbers": "interval",
  "editor.multiCursorModifier": "ctrlCmd",
  "editor.renderWhitespace": "boundary",
  "editor.suggestSelection": "first",
  "editor.unicodeHighlight.invisibleCharacters": false,
  "editor.codeActionsOnSave": {
    "source.fixAll": false,
    "source.fixAll.eslint": true, // this allows ESLint to auto fix on save
    "source.organizeImports": false
  },

  // Extension configs
  "emmet.showSuggestionsAsSnippets": true,
  "emmet.triggerExpansionOnTab": false,
  "errorLens.enabledDiagnosticLevels": ["warning", "error"],
  "errorLens.excludeBySource": ["cSpell", "Grammarly", "eslint"],

  // svg
  "svg.preview.mode": "svg",

  "css.lint.hexColorLength": "ignore",

  // volar
  "volar.autoCompleteRefs": true,
  "volar.codeLens.references": false,
  "volar.codeLens.pugTools": false,
  "volar.codeLens.scriptSetupTools": true,
  "volar.completion.preferredTagNameCase": "pascal",

  // eslint
  "eslint.packageManager": "pnpm",
  "eslint.quiet": true,
  "eslint.validate": [
    "javascript",
    "typescript",
    "javascriptreact",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "json5"
  ],
  "eslint.codeAction.showDocumentation": {
    "enable": true
  },

  // prettier
  "prettier.enable": true, // ! open prettier
  "prettier.singleQuote": true,
  "prettier.trailingComma": "none",
  "prettier.semi": false,
  "prettier.bracketSpacing": true,
  "prettier.printWidth": 80,

  // format
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
