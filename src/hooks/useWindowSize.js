import { useState, useEffect } from "react";

const useWindowSize = () => {

    // intial state
    const [windowSize, setWindowSize] = useState(
        {
            width: undefined,
            height: undefined
        }
    );


    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        handleResize();

        window.addEventListener("resize", handleResize);

        // prevent memory leak because it will happens just once time at the load page, but we needs to remove event after close application
        // you can use useEffect cleanUp function, it will happens when dependency is changed, either file change or when the application closes out
        const cleanUp = () => {
            console.log('runs if a useEffect dep changes');
            window.removeEventListener("resize", handleResize);
        }

        // all you have to do and useEffect to use the cleanUp is the return at the end, that would be called into action
        return cleanUp;

        /* second apporach instead of create function and return it:
            return () => window.removeEventListener("resize", handleResize);
        */

    }, [])

    return windowSize;

}

export default useWindowSize;