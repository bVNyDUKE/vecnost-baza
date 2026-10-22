import { useEffect, useState } from "react";

export const useHashModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    if (window.location.hash !== "#open") {
      window.location.hash = "#open";
    }
  };

  const closeModal = () => {
    if (window.location.hash === "#open") {
      window.location.hash = "";
    }
  };

  const toggleModal = () => {
    if (window.location.hash === "#open") {
      closeModal();
    } else {
      openModal();
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "hashchange",
      () => {
        if (window.location.hash === "#open") {
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};
