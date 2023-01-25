
const redisService = {
    /**
     * Summary: Gets a optional slot prefix, for use with redis enterprise.
     */
    slotPrefix: () => {
        if (process.env.REDIS_SLOTPREFIX && process.env.REDIS_SLOTPREFIX !== '') {
            return `{${process.env.REDIS_SLOTPREFIX}}:`;
        }
        return '';
    }
};

export default redisService;
