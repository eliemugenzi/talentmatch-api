import { Sequelize } from 'sequelize';

import User from './User';
import Application from './Application';

import 'dotenv/config';
import DBConfig from '../config/config';

const env = process.env.NODE_ENV || 'development';
const config: any = DBConfig[env];

User.hasMany(Application, {
  as: 'applications',
  foreignKey: 'user_id',
});

Application.belongsTo(User, {
  as: 'user',
  foreignKey: 'user_id',
});

interface Database {
  sequelize: Sequelize;
}

export const sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);

const db: Database = {
  sequelize,
};

export default db;
