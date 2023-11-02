import {configureStore} from '@reduxjs/toolkit'

import {candyCrushSlice} from "@/app/redux/gameSlice";
import profileReducer from '@/app/redux/profileSlice';

export const store = configureStore({
    reducer: {
        game: candyCrushSlice,
        profile: profileReducer,
    },
    devTools: true
})