"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useCreateProjectModal } from "../hooks/useCreateProjectModal";
import { CreateProjectForm } from "./create-project-form";

export const CreateProjectModal = () => {
  const { isOpen, setIsOpen, close } = useCreateProjectModal();

  return (
    <ResponsiveModal isOpen={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
};
