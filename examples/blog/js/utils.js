

export function truncate(value) {
    if (!value) {
        return '';
    }

    return value.length > 50 ? value.substr(0, 50) + '...' : value;
}
