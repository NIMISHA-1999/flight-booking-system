import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database";

export const getAdminUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Math.max(
      1,
      Number.parseInt(String(req.query.page || "1"), 10) || 1,
    );

    const limitValue =
      Number.parseInt(String(req.query.limit || "10"), 10) || 10;

    const limit = Math.min(
      100,
      Math.max(1, limitValue),
    );

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
     * =====================================================
     * BUILD WHERE
     * =====================================================
     */

    const where: any = {};

    /*
     * SEARCH
     *
     * Search:
     * - first name
     * - last name
     * - email
     */

    if (search.length > 0) {
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
     * =====================================================
     * ROLE FILTER
     * =====================================================
     */

    if (role) {
      where.role = role;
    }

    console.log("====================================");
    console.log("GET ADMIN USERS");
    console.log("Search:", search);
    console.log("Role:", role);
    console.log("Page:", page);
    console.log("Limit:", limit);
    console.log("Where:", JSON.stringify(where, null, 2));
    console.log("====================================");

    /*
     * =====================================================
     * DATABASE
     * =====================================================
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

    /*
     * =====================================================
     * RESPONSE
     * =====================================================
     */

    return res.status(200).json({
      success: true,

      users,

      pagination: {
        page,
        limit,
        total,
        totalPages:
          total > 0
            ? Math.ceil(total / limit)
            : 1,
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