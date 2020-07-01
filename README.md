# workbench-backend
编辑器服务端生产代码
# 下载代码
git clone https://github.com/yunliang-ding/workbench-backend.git 
# 进入项目根目录依次执行
# 安装前后端依赖
```
cnpm install
```
# 安装全局pm2
cnpm install -g pm2
# 启动服务
pm2 startOrReload pm2.json
# 默认端口8090
# git推送功能 
需要配置下ssh
```
1:查看 .ssh
ls -al ~/.ssh
2:生成/设置SSH Key 生成d_rsa和id_rsa.pub
ssh-keygen -t rsa -C "your_email@example.com"
3:将~/.ssh/id_rsa.pub内容 添加到GitLab/github中
```