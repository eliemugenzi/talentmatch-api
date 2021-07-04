import { Model, DataTypes } from 'sequelize';
import { sequelize } from '.';
import User from './User';

class Token extends Model {
  public id!: number;
  public user_id!: number;
  public token!: string;
  public status!: 'active' | 'expired';

  public readonly user?: User;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Token.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    tableName: 'tokens',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

export default Token;
