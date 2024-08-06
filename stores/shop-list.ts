import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

type ShopItem = {
    id: string;
    name: string;
    // Agrega otros campos si es necesario
};

export const useShopListStore = defineStore('shopList', {
    state: () => ({
        shopList: [] as ShopItem[]
    }),
    actions: {
        loadShopList() {
            const jsonString = Cookies.get('shopList');
            this.shopList = jsonString ? JSON.parse(jsonString) : [];
        },
        updateShopList(newList: ShopItem[]) {
            Cookies.set('shopList', JSON.stringify(newList));
            this.shopList = newList;
        }
    }
});