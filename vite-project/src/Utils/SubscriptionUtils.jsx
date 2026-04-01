export const getActiveTotalPrice = (subscriptions) => {
    const activeSubs = subscriptions.filter(sub => sub.isActive !== false);
    
    return activeSubs.reduce((sum, sub) => sum + Number(sub.price), 0);
};

export const getActiveCount = (subscriptions) => {
    return subscriptions.filter(sub => sub.isActive !== false).length;
};