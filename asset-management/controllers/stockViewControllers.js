const db = require('../index');
const Asset = db.Asset;

exports.stockView = async (req, res) => {
  try {
    const availableAssets = await Asset.findAll({
      where: { status: 'Available' }, 
    });
    const branchTotals = availableAssets.reduce((acc, asset) => {
        const branch = asset.branch;
        console.log("Current asset:", asset);
        console.log("Current branch:", branch);

        if (!acc[branch]) {
            console.log("Initializing branch:", branch);
            acc[branch] = { totalCount: 1, totalValue: parseFloat(asset.purchasePrice) };
        } else {
            acc[branch].totalCount += 1;
            acc[branch].totalValue += parseFloat(asset.purchasePrice);
        }
        return acc;
    }, {});
    res.render('stockView/View', { availableAssets, branchTotals });
  } catch (error) {
    console.error('Error fetching stock:', error);
    res.status(500).send('Server Error');
  }
};
