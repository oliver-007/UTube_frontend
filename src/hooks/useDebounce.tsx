// import { useEffect, useState } from "react";

// const useDebounceApi = (inputValue: string) => {
//   const [debounceInput, setDebounceInput] = useState(inputValue);

//   useEffect(() => {
//     const debounceTime = setTimeout(() => {
//       setDebounceInput(inputValue);
//     }, 700);

//     return () => {
//       clearTimeout(debounceTime);
//     };
//   }, [inputValue]);

//   return debounceInput;
// };

// export default useDebounceApi;
import { useEffect, useRef } from "react";

// Custom debounce hook
const useDebounce = (callback: () => void, delay: number) => {
  const timeoutRef = useRef<number | null>(null);

  const debouncedFunction = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      callback();
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFunction;
};

export default useDebounce;
