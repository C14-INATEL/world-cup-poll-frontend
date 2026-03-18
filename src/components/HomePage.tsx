import React, { useState } from "react";
import { Button } from "../components/ui/button";
import CreateGroupModal from "./CreateGroupModal";

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-copa-bg">
      <div className="w-full max-w-md bg-copa-surface border border-copa-border shadow-lg rounded-xl flex flex-col items-center px-8 py-10">
        <h1 className="text-2xl font-bold text-center mb-4 text-copa-primary">Bem vindo</h1>
        <p className="text-copa-text text-center mb-8">
          Aqui você pode criar ou participar de um bolão da copa! Clique no botão abaixo para criar seu grupo e começar a jogar com seus amigos.
        </p>
        <Button
          variant="copa"
          size="copa"
          className="w-full"
          onClick={() => setIsModalOpen(true)}
        >
          Criar grupo bolão
        </Button>
        {isModalOpen && (
          <CreateGroupModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
