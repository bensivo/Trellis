import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { View } from '../models/view-interface';

interface ViewsStore {
    views: View[];
}

const initialState: ViewsStore = {
    views: [
        {
            id: 0,
            name: 'All Notes',
            sql: `SELECT n.name as name, t.name as template
FROM notes n
LEFT JOIN templates t 
    ON n.templateId = t.id`
        }
    ]
}

export const ViewsStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => ({
        set(views: View[]) {
            patchState(store, (_) => ({
                views,
            }))
        },
        // createView(dto: Partial<View>) {
        //     const views = store.views();
        //     const newId = views.length === 0 ? 0 : Math.max(...views.map(t => t.id)) + 1;

        //     const newView: View = {
        //         id: newId,
        //         name: dto.name || '',
        //         sql: dto.sql || '',
        //     };

        //     patchState(store, (state) => ({
        //         views: [...state.views, newView]
        //     }));

        //     return newId;
        // },
        // deleteView(id: number) {
        //     patchState(store, (state) => ({
        //         views: state.views.filter(t => t.id !== id),
        //     }));
        // },
        // updateViewName(id: number, name: string) {
        //     patchState(store, (state) => ({
        //         views: state.views.map(t =>
        //             t.id === id ? { ...t, name } : t
        //         )
        //     }));
        // },
    }))
);