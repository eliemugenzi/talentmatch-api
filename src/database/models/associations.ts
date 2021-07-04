import { Sequelize } from 'sequelize';

import User from './User';
import Application from './Application';
import Token from './Token';
import Job from './Job';

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

Token.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

Job.hasMany(Application, {
  as: 'applications',
  foreignKey: 'job_id',
});

Application.belongsTo(Job, {
  as: 'job',
  foreignKey: 'job_id',
});

interface Database {
  sequelize: Sequelize;
}

export const sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);

const db: Database = {
  sequelize,
};

export default db;
