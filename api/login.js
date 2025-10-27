// 简化版本，避免文件路径问题
const users = [
  { id: 1, username: "admin", password: "admin123" }
];

module.exports = async (req, res) => {
  // 设置 CORS 头部
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      res.status(200).json({ 
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
  } else {
    res.status(405).json({ message: '方法不允许' });
  }
};
