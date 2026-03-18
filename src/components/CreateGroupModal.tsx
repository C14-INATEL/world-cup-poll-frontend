import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-copa-bg bg-opacity-80">
      <div className="w-full max-w-md bg-copa-surface border border-copa-border shadow-lg rounded-xl px-8 py-10 flex flex-col items-center">
        <h2 className="text-xl font-semibold text-center mb-6 text-copa-primary">Criar grupo</h2>
        <Input
          placeholder="Nome do grupo"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="mb-8 w-full"
        />
        <div className="flex w-full gap-4">
          <Button
            variant="copa-ghost"
            size="copa"
            className="w-1/2"
            onClick={onClose}
          >
            cancelar
          </Button>
          <Button
            variant="copa"
            size="copa"
            className="w-1/2"
            onClick={() => {
              // Aqui pode adicionar lógica futura de criação
              onClose();
            }}
            disabled={!groupName.trim()}
          >
            criar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
