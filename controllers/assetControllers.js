const db = require('../index');
const { Op } = require('sequelize');
const Asset = db.Asset;
const Employee = db.Employee;
const AssetCategory = db.AssetCategory;
const AssetHistory = db.AssetHistory

exports.list = async (req, res) => {
  try {
    const assets = await Asset.findAll({
      include: [Employee, AssetCategory],
      order: [['id', 'ASC']]
    });
    res.render('assets/list', { assets });
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).send('Server Error');
  }
};

exports.addForm = async (req, res) => {
  try {
    const categories = await AssetCategory.findAll();
    const employees = await Employee.findAll();
    res.render('assets/assetForm', { categories, employees });
  } catch (error) {
    console.error('Error loading form:', error);
    res.status(500).send('Server Error');
  }
};

exports.add = async (req, res) => {
  try {
    const {
      assetName,
      serialNumber,
      purchaseDate,
      purchasePrice,
      branch,
      status,
      condition,
      categoryId
    } = req.body;

    if (!assetName || !serialNumber || !purchaseDate || !purchasePrice || !branch || !categoryId) {
      return res.status(400).send('All required fields must be filled');
    }

   const newAsset = await Asset.create({
      assetName,
      serialNumber,
      purchaseDate,
      purchasePrice,
      branch,
      status,
      condition,
      assignedTo: null,
      categoryId,
      isScrapped: false,
      scrapDate: null,
      scrapReason: null
    });
    
    await AssetHistory.create({
      assetId: newAsset.id,
      action: 'Purchased',
      description: `Asset purchased on ${new Date().toLocaleDateString()}`,
      date: Date.now()
    });

    res.redirect('/assets');
  } catch (error) {
    console.error('Error adding asset:', error);
    res.status(500).send('Server Error');
  }
};

exports.editForm = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).send('Asset not found');

    const categories = await AssetCategory.findAll();
    const employees = await Employee.findAll();

    res.render('assets/edit', { asset, categories, employees });
  } catch (error) {
    console.error('Error loading asset edit form:', error);
    res.status(500).send('Server Error');
  }
};

exports.edit = async (req, res) => {
  try {
    const {
      assetName,
      serialNumber,
      purchaseDate,
      purchasePrice,
      branch,
      status,
      condition,
      categoryId
    } = req.body;

    if (!assetName || !serialNumber || !purchaseDate || !purchasePrice || !branch || !categoryId) {
      return res.status(400).send('All required fields must be filled');
    }

    await Asset.update(
      {
        assetName,
        serialNumber,
        purchaseDate,
        purchasePrice,
        branch,
        condition,
        categoryId
      },
      { where: { id: req.params.id } }
    );

    res.redirect('/assets');
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).send('Server Error');
  }
};

exports.delete = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).send('Asset not found');

    await asset.destroy();
    res.redirect('/assets');
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).send('Server Error');
  }
};
exports.issue =  async (req, res) => {
  try {
    const availableAssets = await Asset.findAll({ where: { status: 'Available' } });

    const employees = await Employee.findAll({where :{isActive : true}});

    res.render('assets/issued', { availableAssets, employees });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving data');
  }
}

exports.issueSave=async (req, res) => {
  const { assetId, employeeId } = req.body;
  
  try {
    const asset = await Asset.findByPk(assetId);
    
    if (!asset || asset.status !== 'Available') {
      return res.status(400).send('Asset is not available');
    }
    
    const employee = await Employee.findByPk(employeeId);
    
    if (!employee) {
      return res.status(400).send('Employee not found');
    }
    asset.status = 'Issued';  
    asset.assignedTo = employeeId;  
    await asset.save();

    await AssetHistory.create({
      assetId: asset.id,
      action: 'Issued',
      description: `Asset Issued to ${employee.name}`,
      date: Date.now()
    });
    res.redirect('/assets');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error issuing asset');
  }
};

exports.return = async (req, res) => {
  try {
    
    const assignedAssets = await Asset.findAll({
      where: { status: 'Issued', assignedTo: { [Op.ne]: null } }, 
      include: Employee, 
    });
    
    res.render('assets/returned', { assignedAssets });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving data');
  }
}

exports.returnSave = async (req, res) => {
  const { assetId, returnReason } = req.body;

  try {
    const asset = await Asset.findByPk(assetId);
    
    if (!asset || asset.status !== 'Issued') {
      return res.status(400).send('Asset is not issued or does not exist');
    }
    asset.status = 'Available'; 
    asset.assignedTo = null; 
    asset.returnReason = returnReason; 
    await asset.save();

    await AssetHistory.create({
      assetId: asset.id,
      action: 'Returned',
      description: `Asset Returned for ${returnReason}`,
      date: Date.now()
    });

    res.redirect('/assets');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error returning asset');
  }
}

exports.scrap = async (req, res) => {
  try {
    const assets = await Asset.findAll({
      where: { status: 'Available' } 
    });

    res.render('assets/scraped', { assets });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching assets for scrapping');
  }
}

exports.scrapSave = async (req, res) => {
  const assetId = req.body.assetId;

  try {
    const asset = await Asset.findByPk(assetId);

    if (!asset) {
      return res.status(404).send('Asset not found');
    }
    
    asset.isScrapped = true;
    asset.status = 'Scrapped';  
    await asset.save();

    await AssetHistory.create({
      assetId: asset.id,
      action: 'Scraped',
      description: `Asset Scraped`,
      date: Date.now()
    });

    res.redirect('/assets');  
  } catch (error) {
    console.error(error);
    res.status(500).send('Error scrapping the asset');
  }
}