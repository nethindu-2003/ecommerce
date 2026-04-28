const { ComponentLoader } = require('adminjs');

const componentLoader = new ComponentLoader();

const Components = {
    Dashboard: componentLoader.add('Dashboard', '../components/Dashboard'),
};

module.exports = { componentLoader, Components };