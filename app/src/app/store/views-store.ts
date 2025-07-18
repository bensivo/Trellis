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
            sql: `
SELECT n.name as name, t.name as template
FROM notes n
LEFT JOIN templates t 
    ON n.templateId = t.id`
        },
        {
            id: 1,
            name: 'EDP Persons',
            sql: `
SELECT t.name as template, n.name as name, n.Department as department, n.Manager as manager FROM notes n
LEFT JOIN templates t on n.templateId = t.id
WHERE t.name = 'Person'
    AND n.Department = 'EDP'
`
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
    }))
);