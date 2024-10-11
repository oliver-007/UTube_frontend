import { useEffect, useState } from "react";

const useBodyScrollLock = () => {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isLocked ? "hidden" : "auto";
  }, [isLocked]);

  return { isLocked, setIsLocked };
};

export default useBodyScrollLock;
