import { combineReducers, configureStore, createReducer } from "@reduxjs/toolkit";
import formReducer from "./formReducer";
import storage from "redux-persist/lib/storage";
import {persistReducer, persistStore} from "redux-persist";
const persistConfig = {
    key: 'root',
    storage,
} 
const rootReducer = combineReducers({
    form: formReducer
})
const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = configureStore({
    reducer: persistedReducer, 
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
        }
    })
});
const persistor = persistStore(store)
export {persistor, store}