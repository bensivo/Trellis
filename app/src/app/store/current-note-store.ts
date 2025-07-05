import {signalStore, withState} from '@ngrx/signals';

type CurrentNoteState = {
    name: string;
    type: string;
    fields: Array<{
        key: string;
        value: string;
    }>;
    // content: any;
}

const initialState: CurrentNoteState = {
    name: 'Meeting with Alice',
    type: 'Meeting',
    fields: [
        {
            key: 'Date',
            value: '1970-01-01'
        },
        {
            key: 'Decription',
            value: 'Regular sync-up with Alice'
        },
    ],
    // content: 'asdflkj'
}

export const CurrentNoteStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
);