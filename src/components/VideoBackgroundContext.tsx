'use client'
// create a video context to switch the video background based on if the user is currentlying searching
import { createContext, useContext, useState } from "react";

export const VideoContext = createContext({
    isSearching: false,
    setIsSearching: (isSearching: boolean) => { },
});

export const VideoContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isSearching, setIsSearching] = useState(false);
    return (
        <VideoContext.Provider value={{ isSearching, setIsSearching }}>
            {children}
        </VideoContext.Provider>
    );
};

export const useVideoContext = () => useContext(VideoContext);
