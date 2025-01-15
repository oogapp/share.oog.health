'use client'
// create a video context to switch the video background based on if the user is currentlying searching
import { createContext, useContext, useState } from "react";

export const ReflectionContext = createContext({
    isReflection: false,
    setIsReflection: (isReflection: boolean) => { },
});

export const ReflectionContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isReflection, setIsReflection] = useState(false);
    return (
        <ReflectionContext.Provider value={{ isReflection, setIsReflection }}>
            {children}
        </ReflectionContext.Provider>
    );
};

export const useReflectionContext = () => useContext(ReflectionContext);
