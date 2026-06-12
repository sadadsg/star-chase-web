# 腾讯云 SCF 部署指南

## 第一步：部署云函数

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/scf)
2. 点击「新建」→「从 zip 包上传」
3. 选择文件：`/Users/bwsuaideyipi/star-chase/scf-deploy.zip`
4. 配置：
   - 函数名称：`star-chase-api`
   - 运行环境：Node.js 18.13
   - 内存：128MB
   - 超时时间：30秒
   - 执行方法：`index.main_handler`
5. 触发方式：创建「API 网关触发」
6. 点击「完成」

## 第二步：获取 API 地址

部署成功后，在云函数详情页 → 触发管理 → API 网关触发，复制访问地址。

格式类似：`https://service-xxx.gz.apigw.cloud.tencent.com`

## 第三步：更新前端配置

编辑 `src/config.js`，将 API_BASE 改为你的 API 网关地址：

```js
export const API_BASE = import.meta.env.VITE_API_BASE || 'https://service-xxx.gz.apigw.cloud.tencent.com'
```

然后重新构建并部署：
```bash
npm run build
gh-pages -d dist -r https://github.com/sadadsg/star-chase-web.git
```

## 已部署的前端

- 地址：https://sadadsg.github.io/star-chase-web/
- 代码仓库：https://github.com/sadadsg/star-chase-web
