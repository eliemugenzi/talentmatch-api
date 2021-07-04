import { Model, DataTypes } from 'sequelize';
import { sequelize } from '.';

/**
 * Job Class Model
 */

class Job extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public status!: 'open' | 'closed';

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Job.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    underscored: true,
    tableName: 'jobs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

export default Job;
