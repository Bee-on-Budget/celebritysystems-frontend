export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatResolution = (resolution) => {
    if (!resolution) return 'N/A';

    // Convert scientific notation to regular number
    const num = Number(resolution);
    if (num >= 1e6) {
        return `${(num / 1e6).toFixed(1)}M pixels`;
    }
    if (num >= 1e3) {
        return `${(num / 1e3).toFixed(1)}K pixels`;
    }
    return `${num} pixels`;
};