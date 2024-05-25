import { useEffect, useRef } from "react";

const usePrevState = (prevState) => {
    const ref = useRef();

    useEffect(() => {
        ref.current = prevState
    }, [prevState]);

    return ref.current;
};

export default usePrevState;