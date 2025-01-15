'use client'
import { User } from "@/gql/graphql";
// create a video context to switch the video background based on if the user is currentlying searching
import { createContext, useContext } from "react";

export const CurrentUserContext = createContext({
    user: {} as User,
});

export const CurrentUserContextProvider = ({ user, children }: { user: User, children: React.ReactNode }) => {
    return (
        <CurrentUserContext.Provider value={{ user }}>
            {children}
        </CurrentUserContext.Provider>
    );
};

export const useCurrentUser = () => useContext(CurrentUserContext);
