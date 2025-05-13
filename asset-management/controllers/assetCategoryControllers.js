const db = require('../index');
const AssetCategory = db.AssetCategory;

exports.list = async (req, res) => {
  try {
    const assetCategories = await AssetCategory.findAll();
    
    res.render('assetCategories/list', { assetCategories });
  } catch (error) {
    console.error('Error fetching asset categories:', error);
    res.status(500).send('Server Error');
  }
};

exports.addForm = (req, res) => {
  res.render('assetCategories/assetCategoryForm');
};

exports.add = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).send('All fields are required');
    }

    await AssetCategory.create({
      name,
      description: description || '',
    });

    res.redirect('/assetCategories');
  } catch (error) {
    console.error('Error adding asset category:', error);
    res.status(500).send('Server Error');
  }
};

exports.editForm = async (req, res) => {
  try {
    const assetCategory = await AssetCategory.findByPk(req.params.id);

    if (!assetCategory) {
      return res.status(404).send('Asset Category not found');
    }

    res.render('assetCategories/edit', { assetCategory });
  } catch (error) {
    console.error('Error fetching asset category for edit:', error);
    res.status(500).send('Server Error');
  }
};

exports.edit = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).send('All fields are required');
    }

    await AssetCategory.update(
      { 
        name, 
        description
      },
      { where: { id: req.params.id } }
    );

    res.redirect('/assetCategories');
  } catch (error) {
    console.error('Error updating asset category:', error);
    res.status(500).send('Server Error');
  }
};

exports.delete = async (req, res) => {
  try {
    const assetCategory = await AssetCategory.findByPk(req.params.id);

    if (!assetCategory) {
      return res.status(404).send('Asset Category not found');
    }

    await assetCategory.destroy();

    res.redirect('/assetCategories');
  } catch (error) {
    console.error('Error deleting asset category:', error);
    res.status(500).send('Server Error');
  }
};
