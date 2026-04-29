import { ComponentLoader } from 'adminjs';

const componentLoader = new ComponentLoader();

const Components = {
    Dashboard: componentLoader.add('Dashboard', '../components/Dashboard.jsx'),
};

export { componentLoader, Components };