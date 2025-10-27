module.exports = async (req, res) => {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let menuItems = [];

  if (req.method === 'GET') {
    return res.json({
      success: true,
      data: menuItems
    });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { name, type } = body;

      if (!name || !type) {
        return res.status(400).json({
          success: false,
          message: '需要名称和类型'
        });
      }

      const newItem = {
        id: Date.now().toString(),
        name,
        type,
        image: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=' + encodeURIComponent(name),
        createdAt: new Date().toISOString()
      };

      menuItems.push(newItem);

      return res.json({
        success: true,
        data: newItem
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  res.status(405).json({ error: '方法不允许' });
};
