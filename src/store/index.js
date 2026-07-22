import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import subscriptionsReducer from './subscriptionsSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    subscriptions: subscriptionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Supabase session objects are not plain serializable — suppress warning
      serializableCheck: {
        ignoredActions: ['auth/initialize/fulfilled', 'auth/signIn/fulfilled', 'auth/setSession'],
        ignoredPaths: ['auth.session'],
      },
    }),
});

export default store;
