import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '.';

import Application from 'models/Application';

/**
 * User Class Model
 */
class User extends Model {
  public id!: number;
  public password!: string;
  public email!: string;
  public phone_number!: string;
  public first_name!: string;
  public last_name!: string;
  public status!: 'active' | 'inactive';
  public role!: 'applicant' | 'hr';

  public readonly applications?: Application[];
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'applicant',
    },
  },
  {
    sequelize,
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

User.beforeCreate((data) => {
  if (data.password) {
    data.password = bcrypt.hashSync(data.password, 10);
  }
});

export default User;
