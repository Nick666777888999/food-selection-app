module.exports = async (req, res) => {
  res.json({ message: 'API 工作正常!', path: req.url });
};
