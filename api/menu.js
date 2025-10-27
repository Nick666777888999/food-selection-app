// 使用内存存储，避免文件系统问题
let menuItems = [];
const { v4: uuidv4 } = require('uuid');

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
  
  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      data: menuItems
    });
    
  } else if (req.method === 'POST') {
    try {
      const { name, type, image } = req.body;
      
      if (!name || !type) {
        return res.status(400).json({
          success: false,
          message: '菜品名称和类型是必需的'
        });
      }
      
      const newItem = {
        id: uuidv4(),
        name,
        type,
        image: image || 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=' + encodeURIComponent(name),
        createdAt: new Date().toISOString()
      };
      
      menuItems.push(newItem);
      
      res.status(201).json({
        success: true,
        message: '菜品添加成功',
        data: newItem
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '服务器错误: ' + error.message
      });
    }
  } else {
    res.status(405).json({ message: '方法不允许' });
  }
};
