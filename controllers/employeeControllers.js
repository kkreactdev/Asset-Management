const db = require('../index');
const Employee = db.Employee;

exports.list = async (req, res) => {
  const employees = await Employee.findAll();
  res.render('employees/list', { employees });
};

exports.addForm = (req, res) => {
  res.render('employees/employeeForm');
};

exports.add = async (req, res) => {
  console.log('req.body',req)
  const { name, designation, isActive } = req.body;
  await Employee.create({
    name,
    designation,
    branch:'',
    isActive: isActive === 'on',
  });
  res.redirect('/employees');
};

exports.editForm = async (req, res) => {
  const employee = await Employee.findByPk(req.params.id);
  res.render('employees/edit', { employee });
};

exports.edit = async (req, res) => {
  const { name, designation, isActive } = req.body;
  await Employee.update(
    { name, designation, branch:'', isActive: isActive === 'on' },
    { where: { id: req.params.id } }
  );
  res.redirect('/employees');
};
