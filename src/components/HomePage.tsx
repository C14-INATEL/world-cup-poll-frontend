
import { useState } from "react"
import { Button } from "../ui/button"
import CreateGroupModal from "./CreateGroupModal"

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex min-h-svh items-center justify-center bg-copa-bg p-4">
      {/* Fundo decorativo igual AuthPage */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-80 rounded-full bg-copa-accent/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-copa-accent/5 blur-3xl" />
      </div>

      {/* Card principal */}
      <div className="relative w-full max-w-md rounded-2xl border border-copa-border bg-copa-surface p-8 shadow-2xl shadow-black/20 text-center">
        <h1 className="text-2xl font-bold text-copa-text">Bem vindo</h1>
        <p className="mt-3 text-copa-text-muted">
          Participe do bolão da Copa! Crie um grupo para desafiar seus amigos e ver quem entende mais de futebol. (Texto placeholder)
        </p>
        <Button
          variant="copa"
          size="copa"
          className="mt-8 w-full"
          onClick={() => setIsModalOpen(true)}
        >
          Criar grupo bolão
        </Button>
      </div>

      {/* Modal de criar grupo */}
      {isModalOpen && (
        <CreateGroupModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

export default HomePage
