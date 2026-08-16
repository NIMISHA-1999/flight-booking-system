"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminUsers = void 0;
const database_1 = require("../config/database");
const getAdminUsers = async (req, res, next) => {
    try {
        const pageParam = Number(req.query.page);
        const limitParam = Number(req.query.limit);
        const page = Number.isFinite(pageParam) && pageParam > 0
            ? Math.floor(pageParam)
            : 1;
        const limit = Number.isFinite(limitParam) &&
            limitParam > 0 &&
            limitParam <= 100
            ? Math.floor(limitParam)
            : 10;
        const search = typeof req.query.search === "string"
            ? req.query.search.trim()
            : "";
        const role = typeof req.query.role === "string"
            ? req.query.role.trim().toUpperCase()
            : "";
        const skip = (page - 1) * limit;
        const where = {};
        // Search registered website users
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
        // Optional role filter
        if (role) {
            where.role = role;
        }
        const [users, total] = await Promise.all([
            database_1.prisma.user.findMany({
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
            database_1.prisma.user.count({
                where,
            }),
        ]);
        return res.status(200).json({
            success: true,
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error("GET ADMIN USERS ERROR:", error);
        next(error);
    }
};
exports.getAdminUsers = getAdminUsers;
//# sourceMappingURL=admin.user.controller.js.map