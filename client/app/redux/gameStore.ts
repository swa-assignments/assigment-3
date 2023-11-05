import {configureStore} from '@reduxjs/toolkit'

import candyCrushReducer from "@/app/redux/gameSlice";
import profileReducer from '@/app/redux/profileSlice';

export const store = configureStore({
    reducer: {
        game: candyCrushReducer,
        profile: profileReducer,
    }
})