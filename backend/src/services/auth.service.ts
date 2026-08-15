import { prisma } from "../config/database";
import { RegisterDto, LoginDto } from "../types/auth.types";
import { hashPassword, comparePassword } from "../utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import crypto from "crypto";

export class AuthService {
  /**
   * Hash refresh token before storing it in DB.
   * We never store the raw refresh token.
   */
  private hashRefreshToken(token: string) {
    return crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  }

  /**
   * Store refresh token in database.
   */
  private async saveRefreshToken(
    userId: string,
    refreshToken: string
  ) {
    const tokenHash =
      this.hashRefreshToken(refreshToken);

    const expiresAt = new Date();

    // Refresh token lifetime: 7 days
    expiresAt.setDate(
      expiresAt.getDate() + 7
    );

    await prisma.refreshToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
      },
    });
  }

  /**
   * Register
   */
  async register(data: RegisterDto) {
    const email = data.email
      .trim()
      .toLowerCase();

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      throw new Error(
        "Email already exists"
      );
    }

    const passwordHash =
      await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email,
        passwordHash,
      },
    });

    const accessToken =
      generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

    const refreshToken =
      generateRefreshToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

    await this.saveRefreshToken(
      user.id,
      refreshToken
    );

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login
   */
  async login(data: LoginDto) {
    const email = data.email
      .trim()
      .toLowerCase();

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      throw new Error(
        "Invalid email or password"
      );
    }

    const isPasswordCorrect =
      await comparePassword(
        data.password,
        user.passwordHash
      );

    if (!isPasswordCorrect) {
      throw new Error(
        "Invalid email or password"
      );
    }

    const accessToken =
      generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

    const refreshToken =
      generateRefreshToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

    await this.saveRefreshToken(
      user.id,
      refreshToken
    );

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token.
   *
   * Old refresh token is revoked and
   * a new refresh token is generated.
   */
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new Error(
        "Refresh token is required"
      );
    }

    let payload;

    try {
      payload =
        verifyRefreshToken(refreshToken);
    } catch {
      throw new Error(
        "Invalid or expired refresh token"
      );
    }

    const tokenHash =
      this.hashRefreshToken(refreshToken);

    const storedToken =
      await prisma.refreshToken.findUnique({
        where: {
          tokenHash,
        },
      });

    if (!storedToken) {
      throw new Error(
        "Refresh token not found"
      );
    }

    if (storedToken.revokedAt) {
      throw new Error(
        "Refresh token has been revoked"
      );
    }

    if (
      storedToken.expiresAt <
      new Date()
    ) {
      throw new Error(
        "Refresh token has expired"
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
      });

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    // Revoke old refresh token
    await prisma.refreshToken.update({
      where: {
        id: storedToken.id,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    // Generate new tokens
    const accessToken =
      generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

    const newRefreshToken =
      generateRefreshToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

    await this.saveRefreshToken(
      user.id,
      newRefreshToken
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout.
   *
   * Revoke the refresh token in database.
   */
  async logout(refreshToken: string) {
    if (!refreshToken) {
      return;
    }

    const tokenHash =
      this.hashRefreshToken(refreshToken);

    const storedToken =
      await prisma.refreshToken.findUnique({
        where: {
          tokenHash,
        },
      });

    if (!storedToken) {
      return;
    }

    if (!storedToken.revokedAt) {
      await prisma.refreshToken.update({
        where: {
          id: storedToken.id,
        },
        data: {
          revokedAt: new Date(),
        },
      });
    }
  }
}

export default new AuthService();