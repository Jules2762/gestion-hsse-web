import api from ".";

export default {
    index() {
        return api.get('/home/notifications');
    },
    markAllRead() {
        return api.post('/home/notifications/mark-all-read');
    },
    markAsRead(id: string) {
        return api.put(`/home/notifications/${id}/read`);
    },
    destroy(id: string) {
        return api.delete(`/home/notifications/${id}`);
    },
    clearAll() {
        return api.delete('/home/notifications');
    },
};
