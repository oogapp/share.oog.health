'use client'
import { User } from "@/gql/graphql";
// create a video context to switch the video background based on if the user is currentlying searching
import { createContext, useContext, useEffect } from "react";

export const CurrentUserContext = createContext({
    user: {} as User,
});

export const CurrentUserContextProvider = ({ user, children }: { user: User, children: React.ReactNode }) => {

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === "askAnotherQuestion") {
                window.location.href = "/chat";
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    return (
        <CurrentUserContext.Provider value={{ user }}>
            {children}
        </CurrentUserContext.Provider>
    );
};

export const useCurrentUser = () => useContext(CurrentUserContext);
