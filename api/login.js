const express = require('express');
const cors = require('cors');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 用户数据
const users = [
  { id: 1, username: "admin", password: "admin123" }
];

// 路由
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.json({ 
      success: true, 
      message: '登录成功',
      user: { id: user.id, username: user.username }
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: '用户名或密码错误' 
    });
  }
});

// Vercel 需要导出 app
module.exports = app;
