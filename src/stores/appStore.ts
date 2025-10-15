import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import localforage from 'localforage';

// Configure LocalForage
const storage = localforage.createInstance({
  name: 'portal-dmconta',
  storeName: 'app-store'
});

// Generic CRUD Interface
interface GenericCRUD<T> {
  items: T[];
  add: (item: T) => void;
  remove: (id: string) => void;
  update: (id: string, item: Partial<T>) => void;
  clear: () => void;
  findById: (id: string) => T | undefined;
  findBy: (predicate: (item: T) => boolean) => T[];
}

// Generic Store Factory
export function createGenericStore<T extends { id: string }>(storeName: string) {
  return create<GenericCRUD<T>>()(
    persist(
      (set, get) => ({
        items: [],
        
        add: (item) => set((state) => ({
          items: [...state.items, { ...item, id: item.id || Date.now().toString() }]
        })),
        
        remove: (id) => set((state) => ({
          items: state.items.filter(item => item.id !== id)
        })),
        
        update: (id, updates) => set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, ...updates } : item
          )
        })),
        
        clear: () => set({ items: [] }),
        
        findById: (id) => get().items.find(item => item.id === id),
        
        findBy: (predicate) => get().items.filter(predicate)
      }),
      {
        name: storeName,
        storage: {
          getItem: async (name) => {
            try {
              const value = await storage.getItem(name);
              return value ? JSON.parse(value as string) : null;
            } catch (error) {
              console.error('Error loading from storage:', error);
              return null;
            }
          },
          setItem: async (name, value) => {
            try {
              await storage.setItem(name, JSON.stringify(value));
            } catch (error) {
              console.error('Error saving to storage:', error);
            }
          },
          removeItem: async (name) => {
            try {
              await storage.removeItem(name);
            } catch (error) {
              console.error('Error removing from storage:', error);
            }
          }
        }
      }
    )
  );
}

// Default generic store
export const useAppStore = createGenericStore;




