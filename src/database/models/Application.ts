import { Model, DataTypes } from 'sequelize';
import { sequelize } from '.';

import User from 'models/User';
import Job from './Job';

/**
 * Application Class Model
 */
class Application extends Model {
  public id!: number;
  public resume_url!: string;
  public status!: 'passed' | 'dropped' | 'pending';
  public user_id!: number;
  public job_id!: number;
  public description!: string;

  public readonly user?: User;
  public readonly job?: Job;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Application.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT,
    },
    resume_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
    user_id: {
      type: DataTypes.BIGINT,
    },
    job_id: {
      type: DataTypes.BIGINT,
    },
  },
  {
    sequelize,
    tableName: 'applications',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

export default Application;
