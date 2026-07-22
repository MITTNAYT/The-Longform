import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { initializeAuth, setSession, clearAuth } from "./store/authSlice";
import { fetchSubscriptions } from "./store/subscriptionsSlice";
import { supabase } from "./lib/supabase";
import Routes from "./Routes";

function AppWithStore() {
  useEffect(() => {
    // 1. Initialize auth state from existing session on mount
    store.dispatch(initializeAuth());

    // 2. Listen for auth state changes (sign-in, sign-out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          store.dispatch(clearAuth());
        } else {
          store.dispatch(setSession(session));
          // Re-fetch profile on token refresh / sign-in
          if (event === 'SIGNED_IN') {
            store.dispatch(initializeAuth());
            store.dispatch(fetchSubscriptions(session.user.id));
          } else if (event === 'INITIAL_SESSION') {
            store.dispatch(fetchSubscriptions(session.user.id));
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return <Routes />;
}

function App() {
  return (
    <Provider store={store}>
      <AppWithStore />
    </Provider>
  );
}

export default App;
