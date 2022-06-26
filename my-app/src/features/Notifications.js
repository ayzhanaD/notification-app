import {createSlice} from '@reduxjs/toolkit';

import {NotificationsData} from '../FakeData.js';

export const notificationSlice = createSlice({

    name: "notifications",
    initialState: {value: NotificationsData},
    reducers: {
        addNoti: (state, action) => {
            state.value.push(action.payload);
        },

        deleteNoti: (state, action) => {
            state.value = state.value.filter((notification) => notification.id !== action.payload.id);
        },

        updateContent: (state, action) => {
            state.value.map((notification) => {
                if(notification.id === action.payload.id){
                    notification.content = action.payload.content;
                }
                return notification.content;
            })
        },

        updateTitle: (state, action) => {
            state.value.map((notification) => {
                if(notification.id === action.payload.id){
                    notification.title = action.payload.title;
                }
                return notification.title;
            })
        }
        
    },
});

export const {addNoti, deleteNoti, updateContent, updateTitle} = notificationSlice.actions;
export default notificationSlice.reducer;