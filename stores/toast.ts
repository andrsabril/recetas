import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
    state: () => ({
        toasts: [] as Array<{
            id: number;
            text: string;
            color: string;
            icon: string;
            link: string;
        }>
    }),

    actions: {
        addToast(
            text: string,
            color: string,
            icon: string = '',
            link: string = '',
        ) {
            const id = Date.now(); // Genera un ID único basado en la marca de tiempo
            this.toasts.push({ id, text, color, icon, link, });

            // Ocultar el toast después de 8 segundos
            setTimeout(() => {
                this.removeToast(id);
            }, 4000);
        },

        removeToast(id: number) {
            this.toasts = this.toasts.filter(toast => toast.id !== id);
        }
    }
});
