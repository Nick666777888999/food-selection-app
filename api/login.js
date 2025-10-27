module.exports = async (req, res) => {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { username, password } = body;

      if (username === 'admin' && password === 'admin123') {
        return res.json({
          success: true,
          user: { username: 'admin' }
        });
      } else {
        return res.status(401).json({
          success: false,
          message: '用户名或密码错误'
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  res.status(405).json({ error: '方法不允许' });
};
