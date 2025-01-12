'use client'
// create a video context to switch the video background based on if the user is currentlying searching
import { createContext, useContext, useEffect, useState } from "react";

export const KeyboardOpenContext = createContext({
    isOpen: false,
    setOpen: (isOpen: boolean) => { },
});

export const KeyboardOpenContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // set the body height to the visualviewport height, with overflow-x
            let h = window?.visualViewport?.height
            if (h) {
                document.body.style.height = `${h}px`
                document.body.style.overflowX = 'hidden'
            }

        } else {
            // reset the body height and overflow-x
            document.body.style.height = ''
            document.body.style.overflowX = ''
        }
    }, [isOpen]);

    return (
        <KeyboardOpenContext.Provider value={{ isOpen, setOpen }}>
            {children}
        </KeyboardOpenContext.Provider>
    );
};

export const useKeyboardOpenContext = () => useContext(KeyboardOpenContext);
