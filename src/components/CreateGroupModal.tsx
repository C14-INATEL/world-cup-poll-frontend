
import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface CreateGroupModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("")
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-copa-bg/80">
      <div className="relative w-full max-w-md rounded-2xl border border-copa-border bg-copa-surface p-8 shadow-2xl shadow-black/20 text-center">
        <h2 className="text-2xl font-bold text-copa-text mb-6">Criar grupo</h2>
        <Input
          placeholder="Nome do grupo"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          className="mb-8"
        />
        <div className="flex gap-4">
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
              // Lógica futura de criação
              onClose()
            }}
            disabled={!groupName.trim()}
          >
            criar
          </Button>
        </div>
      </div>
    </div>
  )
}
