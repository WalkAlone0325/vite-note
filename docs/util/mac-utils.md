# 前端相关工具及配置环境

配置常用开发环境

## 安装 HomeBrew

官网：[https://brew.sh](https://brew.sh)

1. 有条件的同学可以直接使用官网提供的命令进行安装

   `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

2. 使用镜像源安装(一般选择中科大学就好了)

   `/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"`

3. 卸载

   `/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/HomebrewUninstall.sh)" `

## 安装 Item2

官网：[https://iterm2.com](https://iterm2.com)

> 直接点击下载安装即可

### 安装和配置 oh-my-zsh 及相关插件

官网：[https://ohmyz.sh](https://ohmyz.sh)

#### 安装

安装命令： 

1. 官网源： `sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`
2. 镜像源： `sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"`

安装过程中输出如下：

```sh
xxxx% sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" 
Cloning Oh My Zsh...
Cloning into '/Users/xxxx/.oh-my-zsh'...
remote: Counting objects: 831, done.
remote: Compressing objects: 100% (700/700), done.
remote: Total 831 (delta 14), reused 775 (delta 10), pack-reused 0
Receiving objects: 100% (831/831), 567.67 KiB | 75.00 KiB/s, done.
Resolving deltas: 100% (14/14), done.
Looking for an existing zsh config...
Found ~/.zshrc. Backing up to ~/.zshrc.pre-oh-my-zsh
Using the Oh My Zsh template file and adding it to ~/.zshrc
             __                                     __   
      ____  / /_     ____ ___  __  __   ____  _____/ /_  
     / __ \/ __ \   / __ `__ \/ / / /  /_  / / ___/ __ \ 
    / /_/ / / / /  / / / / / / /_/ /    / /_(__  ) / / / 
    \____/_/ /_/  /_/ /_/ /_/\__, /    /___/____/_/ /_/  
                            /____/                       ....is now installed!
Please look over the ~/.zshrc file to select plugins, themes, and options.
p.s. Follow us at https://twitter.com/ohmyzsh.
p.p.s. Get stickers and t-shirts at http://shop.planetargon.com.
```

#### 设置主题

```sh
open ~/.zshrc

# 找到 ZSH_THEME
# robbyrussell 是默认的主题
ZSH_THEME="robbyrussell"

# ZSH_THEME="样式名称"

# 设置随机主题
# ZSH_THEME="random"
```

#### 安装插件

1. 推荐插件：
    1. `zsh-autosuggestions`：作用基本上是根据历史输入指令的记录即时的提示

        `git clone git://github.com/zsh-users/zsh-autosuggestions`

    2. `zsh-syntax-highlighting`：命令高亮插件，输入为绿色时表示可用命令，路径带有下划线时表示可用路径

        `git clone https://github.com/zsh-users/zsh-syntax-highlighting.git`

2. 配置插件修改 `.zshrc`

    ```sh
    plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
    ```

3. 配置生效

    `source .zshrc`



## 安装 VSCode

官网：[https://code.visualstudio.com/Download](https://code.visualstudio.com/Download)

::: danger
注意下载版本，下载后直接拖入应用程序中
:::

## 配置常用别名(.zshrc)

```sh
alias p="pnpm"
alias pr="pnpm run"
alias pd="pnpm run dev"
alias pi="pnpm install"
alias pa="pnpm add"
alias pb="pnpm build"
alias pc="pnpm clean"

alias cls="clear"
alias glog="git log --graph --oneline --decorate --all"
alias gl="git clone"
alias gs="git status"
alias gd="git diff"
alias gc="git commit"
alias gca="git commit -a"
alias gco="git checkout"
alias gb="git branch"
alias gba="git branch -a"
alias gpl="git pull"
alias gps="git push"
alias gph="git push heroku"

alias e="exit"
```