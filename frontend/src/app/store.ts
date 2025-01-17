import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import userReducer from "./slice/userSlice";

// Configure Redux Persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // Only persist the user slice
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/FLUSH", "persist/PAUSE", "persist/PURGE", "persist/REGISTER"],
      },
    }),
});

// Persistor to manage persisted state
const persistor = persistStore(store);

export { store, persistor };

// Infer types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
