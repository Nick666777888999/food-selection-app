const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// 模擬數據庫
let dishes = [
    {
        id: 1,
        name: '香煎雞排',
        type: 'meal',
        description: '鮮嫩多汁的雞排，搭配特製醬料，口感豐富。',
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        selectedBy: [1, 3],
        selectCount: 12,
        badge: 'popular'
    },
    {
        id: 2,
        name: '牛肉漢堡套餐',
        type: 'combo',
        description: '經典美式漢堡，搭配薯條和可樂，完美組合。',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        selectedBy: [2],
        selectCount: 8,
        badge: 'new'
    }
];

let selections = [
    { id: 1, userId: 1, userName: '蕭上竣', dishId: 1, dishName: '香煎雞排' },
    { id: 2, userId: 2, userName: '蕭華亨', dishId: 2, dishName: '牛肉漢堡套餐' },
    { id: 3, userId: 3, userName: '張婉婷', dishId: 1, dishName: '香煎雞排' }
];

// API 路由
app.get('/api/dishes', (req, res) => {
    res.json(dishes);
});

app.post('/api/dishes', (req, res) => {
    const { name, type, description, image } = req.body;
    
    const newDish = {
        id: dishes.length + 1,
        name,
        type,
        description,
        image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        selectedBy: [],
        selectCount: 0
    };
    
    dishes.push(newDish);
    res.status(201).json(newDish);
});

app.get('/api/selections', (req, res) => {
    res.json(selections);
});

app.post('/api/selections', (req, res) => {
    const { userId, userName, dishId } = req.body;
    
    const existingSelection = selections.find(s => 
        s.userId === userId && s.dishId === dishId
    );
    
    if (existingSelection) {
        selections = selections.filter(s => 
            !(s.userId === userId && s.dishId === dishId)
        );
        
        const dish = dishes.find(d => d.id === dishId);
        if (dish) {
            dish.selectedBy = dish.selectedBy.filter(id => id !== userId);
            dish.selectCount = dish.selectedBy.length;
        }
    } else {
        const dish = dishes.find(d => d.id === dishId);
        if (!dish) {
            return res.status(404).json({ error: '菜品不存在' });
        }
        
        const newSelection = {
            id: selections.length + 1,
            userId,
            userName,
            dishId,
            dishName: dish.name
        };
        
        selections.push(newSelection);
        
        dish.selectedBy.push(userId);
        dish.selectCount = dish.selectedBy.length;
    }
    
    res.status(201).json(selections);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 添加 favicon 路由避免 404
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

app.listen(PORT, () => {
    console.log(`伺服器運行在端口 ${PORT}`);
});
