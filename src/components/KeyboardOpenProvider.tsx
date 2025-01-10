'use client'
// create a video context to switch the video background based on if the user is currentlying searching
import { createContext, useContext, useState } from "react";

export const KeyboardOpenContext = createContext({
    isOpen: false,
    setOpen: (isOpen: boolean) => { },
});

export const KeyboardOpenContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setOpen] = useState(false);
    return (
        <KeyboardOpenContext.Provider value={{ isOpen, setOpen }}>
            {children}
        </KeyboardOpenContext.Provider>
    );
};

export const useKeyboardOpenContext = () => useContext(KeyboardOpenContext);
