# 玩转二课｜GitHub Pages 部署说明

这个文件夹是可直接部署的静态网站。请将文件夹中的内容上传到 GitHub 仓库根目录，不要只上传压缩包，也不要多套一层文件夹。

## 方法一：网页上传

1. 打开 GitHub，新建一个 **Public** 仓库。
2. 仓库名建议使用 `second-classroom`。
3. 进入仓库，选择 `Add file` -> `Upload files`。
4. 将本文件夹中的 `index.html`、`styles.css`、`script.js`、`assets`、`.github`、`.nojekyll` 全部上传到仓库根目录。
5. 提交到 `main` 分支。
6. 打开仓库的 `Settings` -> `Pages`。
7. 在 `Build and deployment` 中选择 `GitHub Actions`。
8. 打开 `Actions`，等待 `Deploy static site to GitHub Pages` 显示绿色成功。
9. 回到 `Settings` -> `Pages` 查看网址。

## 网址格式

如果仓库名是 `second-classroom`，网址通常是：

`https://<你的GitHub用户名>.github.io/second-classroom/`

如果仓库名是 `<你的GitHub用户名>.github.io`，网址通常是：

`https://<你的GitHub用户名>.github.io/`

## 更新网页

以后修改网页文件后，将文件重新上传或推送到 `main` 分支，GitHub Actions 会自动重新发布。
