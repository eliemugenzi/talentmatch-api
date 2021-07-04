import bcrypt from 'bcryptjs';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import Token from 'models/Token';
import User from 'models/User';

const { JWT_SECRET_KEY = '' } = process.env;

/**
 * Auth Helper class
 */
class AuthHelper {
  /**
   *
   * @param {string} password
   * @returns {string} hashed password
   */
  static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  /**
   *
   * @param {string} password
   * @param {string} hashedPassword
   * @returns {boolean} Boolean value
   */
  static comparePassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  /**
   *
   * @param {any} payload
   * @param {string} expiresIn
   * @returns {Promise} A generated token
   */
  static async generateToken(payload: Record<string, any>, expiresIn = '30d'): Promise<string> {
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn });
    const expireDay = expiresIn.slice(0, -1);

    const user = await User.findByPk(payload.id);

    const args: any = {
      user_id: user?.id,
      token,
    };

    const tokenExpiry = moment().add(parseInt(expireDay, 10), 'days').format();

    args.expired_at = tokenExpiry;

    await Token.create(args);

    return token;
  }
}

export default AuthHelper;
