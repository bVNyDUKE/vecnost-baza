import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import type { ReactNode } from "react";

export const SideDrawer = ({
  show,
  onClose,
  children,
}: {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  return (
    <Dialog open={show} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition-opacity duration-300 ease-out data-closed:opacity-0 data-leave:duration-200 data-leave:ease-in motion-reduce:transition-none"
      />
      <DialogPanel
        transition
        className="fixed inset-y-0 left-0 right-0 overflow-y-auto overscroll-contain bg-white text-gray-700 shadow-md transition-transform duration-300 ease-out data-closed:-translate-x-full data-leave:duration-200 data-leave:ease-in motion-reduce:transition-none lg:right-auto lg:w-1/2"
      >
        {children}
      </DialogPanel>
    </Dialog>
  );
};
