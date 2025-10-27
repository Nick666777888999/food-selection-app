const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 内存存储
let menuItems = [];

// 路由
app.get('/api/menu', (req, res) => {
  res.json({
    success: true,
    data: menuItems
  });
});

app.post('/api/menu', (req, res) => {
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
});

// Vercel 需要导出 app
module.exports = app;
