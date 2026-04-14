export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Access denied',
                message: 'You do not have permission to access this resource'
            });
        }

        next();
    };
};

export const checkOwnership = (getOwnerId) => {
    return async (req, res, next) => {
        try {
            const ownerId = await getOwnerId(req);

            if (ownerId !== req.user.id) {
                return res.status(403).json({
                    error: 'Access denied',
                    message: 'You can only modify your own resources'
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({ error: 'Ownership check failed' });
        }
    };
};
