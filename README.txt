沿途 · 公开相册 + 鹦鹉暗号小窝

网站有两部分：
1. 首页公开相册：朋友拿到网址即可浏览。
2. 首页的鹦鹉是隐藏入口。单击即可进入；输入正确答案后进入小窝。

暗号弹窗
题目：🦜小鸟叫什么？
暗号就是唯一的进入条件，不需要邮箱或账号密码。正确答案由 Supabase Edge Function 在服务端验证，网页前端不会保存答案。不要把正确答案写在 README、公开网页或代码文件里。知道答案的人也能进入；如果担心别人猜到，可以之后换成更长、更私密的答案。

本地预览
双击 index.html 预览公开相册。小窝功能需要先配置 Supabase；配置前，弹窗会提示尚未连接。

添加公开照片和视频
公开旅行数据在 memories.js，页面行为在 app.js。公开媒体放在 media 文件夹。nest-bird-rest.png 是鹦鹉默认状态，nest-bird-wave.png 是悬停状态。私密文件不要放在 media 文件夹。

启用小窝（Supabase）
1. 创建 Supabase 项目。
2. 在 Storage 创建名为 private-album 的 bucket，访问类型保持 Private。
3. 打开 SQL Editor，运行 supabase-setup.sql。
4. 打开 Edge Function Secrets，新增 ALBUM_PASSPHRASE，并把暗号答案作为 secret 的值。不要把答案写在 README、网页代码或 GitHub 仓库里。
5. 在 private-config.js 填入 Project URL 和 publishable/anon key。不要填 service_role/secret key。
6. 安装 Supabase CLI 并登录，然后在项目目录运行：
   supabase login
   supabase link --project-ref 你的项目编号
   supabase functions deploy unlock-album
7. function 部署后，单击首页鹦鹉，输入你设置的暗号确认可以进入。

添加私密照片和视频（以后需要时再做）
1. 把文件上传到 Supabase Storage 的 private-album bucket，不要传到公开 media 文件夹。
2. 在 Supabase 的 private_memories 表新增旅行记录。media 字段是 JSON 数组，文件 path 填 bucket 内路径，例如：
   [{"path":"2026/kyoto.jpg","type":"image","caption":"只留给我们的照片"},{"path":"2026/walk.mp4","type":"video","caption":"散步片段"}]
3. 退出后重新回答暗号进入。系统会为媒体生成 15 分钟有效的临时链接；过期后重新答暗号即可刷新。

安全和日志
正确答案是唯一的入口条件，不需要两个账号。它是三字答案，如果有人知道或猜到答案，也能打开小窝；需要时可以改成更长的私密暗号。密钥和答案由 Supabase Edge Function 服务端读取，服务端密钥绝不能放入网页。
网站代码不主动记录访客 IP，但 Vercel、Supabase 等托管平台仍可能处理请求数据或生成日志。Supabase Edge Function 的调用也会产生平台日志与指标；部署前请查看平台最新的日志保留和隐私设置。
Vercel 隐私声明：https://vercel.com/legal/privacy-notice
Vercel 日志文档：https://vercel.com/docs/logs
Supabase Function Secrets：https://supabase.com/docs/guides/functions/secrets

公开范围提醒
公开相册网址可以被转发，公开照片和视频也可能被保存或直接访问。上传前确认照片中的人同意公开，保留原始文件备份。
