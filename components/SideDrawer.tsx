import { Transition } from "@headlessui/react";
import { ReactNode } from "react";

export const SideDrawer = ({
  show,
  children,
}: {
  show: boolean;
  children: ReactNode;
}) => (
  <Transition
    show={show}
    className="top-15 fixed bottom-5 left-0 right-5 z-50 h-[90vh] w-full rounded-lg bg-white text-gray-700 lg:top-0 lg:bottom-0 lg:h-[100vh] lg:w-1/2"
    enter="transition delay-150 duration-500 ease-in-out"
    enterFrom="-translate-x-full"
    enterTo="translate-x-0"
    leave="transition duration-500 delay-150 ease-in-out"
    leaveFrom="translate-x-0"
    leaveTo="-translate-x-full"
  >
    <Transition.Child
      enter="transition-opacity duration-700"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-700"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className="h-[84vh] overflow-auto py-2 shadow-md lg:h-[95vh]"
    >
      {children}
    </Transition.Child>
  </Transition>
);
