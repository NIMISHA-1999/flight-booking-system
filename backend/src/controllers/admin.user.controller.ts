import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database";

export const getAdminUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pageParam = Number(req.query.page);
    const limitParam = Number(req.query.limit);

    const page =
      Number.isFinite(pageParam) && pageParam > 0
        ? Math.floor(pageParam)
        : 1;

    const limit =
      Number.isFinite(limitParam) &&
      limitParam > 0 &&
      limitParam <= 100
        ? Math.floor(limitParam)
        : 10;

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const role =
      typeof req.query.role === "string"
        ? req.query.role.trim().toUpperCase()
        : "";

    const skip = (page - 1) * limit;

    /*
     * Build Prisma WHERE condition
     */
    const where: any = {};

    /*
     * Search by first name, last name or email
     */
    if (search) {
      where.OR = [
        {
          firstName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    /*
     * Filter by role
     */
    if (role) {
      where.role = role;
    }

    /*
     * Get users + total count
     */
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),

      prisma.user.count({
        where,
      }),
    ]);

    const totalPages =
      total === 0
        ? 0
        : Math.ceil(total / limit);

    return res.status(200).json({
      success: true,

      users,

      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error(
      "GET ADMIN USERS ERROR:",
      error,
    );

    next(error);
  }
};