// Credits to vegeta897 for this.
// https://github.com/vegeta897/snow-stamp/blob/main/src/convert.js

const DISCORD_EPOCH = 1420070400000;

// Converts a snowflake ID string into a JS Date object using the provided epoch (in ms), or Discord's epoch if not provided
const convertSnowflakeToDate = (snowflake: string, epoch: number) => {
    // Convert snowflake to BigInt to extract timestamp bits
    // https://discord.com/developers/docs/reference#snowflakes
    const milliseconds = BigInt(snowflake) >> 22n;
    return new Date(Number(milliseconds) + epoch);
};

/**
 * Validates a snowflake ID string and returns a JS Date object if valid
 * @param snowflake
 * @param epoch
 * @returns whether the snowflake is valid
 */
export default (snowflake: string, epoch = DISCORD_EPOCH): boolean => {
    if (!Number.isInteger(+snowflake)) {
        return false;
    }

    if (Number(snowflake) < 4194304) {
        return false;
    }

    const timestamp = convertSnowflakeToDate(snowflake, epoch);

    if (Number.isNaN(timestamp.getTime())) {
        return false;
    }

    return true;
};
