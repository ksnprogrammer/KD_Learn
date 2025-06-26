'use client';

import { createContext, useContext, createElement } from 'react';
import type { User } from '@supabase/supabase-js';

const UserContext = createContext<User | null>(null);

export function UserProvider({ children, user }: { children: React.ReactNode, user: User | null }) {
    return createElement(UserContext.Provider, { value: user }, children);
}

export function useUser() {
    const context = useContext(UserContext);
    // The context is not checked for undefined because the layout ensures a user exists.
    // If a page is accessible without a user, it should handle the null case explicitly.
    return context;
}
