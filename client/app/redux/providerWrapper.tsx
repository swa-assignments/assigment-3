"use client";

import {Provider} from "react-redux";
import {store} from "@/app/redux/gameStore";

// Needed for Redux and Next.js >=13 (different folder structure)
export function ProviderWrapper({children}) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}

export default ProviderWrapper;
