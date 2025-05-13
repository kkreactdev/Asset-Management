const db = require('../index');
const Asset = db.Asset
const AssetHistory = db.AssetHistory;

exports.selectAsset = async (req, res) => {
    const assets = await Asset.findAll(); // optional filter
    res.render('assetHistories/list', { assets });
  };
exports.viewHistory = async (req, res) => {
    const { assetId } = req.body;
    const asset = await Asset.findByPk(assetId);
    const history = await AssetHistory.findAll({ where: { assetId }, order: [['date', 'DESC']] });
  
    res.render('assetHistories/view', { asset, history });
  }