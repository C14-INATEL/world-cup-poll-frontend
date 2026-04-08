import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCreatePollMutation } from "@/features/poll/create-poll/use-create-poll-mutation";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";

interface CreatePollModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POOL_CODE_LENGTH = 10;

const createPollSchema = z.object({
  title: z.string().min(1, "Informe o nome do grupo"),
  code: z
    .string()
    .length(POOL_CODE_LENGTH, `O codigo deve ter ${POOL_CODE_LENGTH} caracteres`)
    .regex(/^[A-Z0-9]+$/, "Use apenas letras e numeros"),
});

type CreatePollFormValues = z.infer<typeof createPollSchema>;

function sanitizePoolCode(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, POOL_CODE_LENGTH);
}

function generateRandomPoolCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: POOL_CODE_LENGTH }, () => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
  }).join("");
}

export function CreatePollModal({ isOpen, onClose }: CreatePollModalProps) {
  const createPollMutation = useCreatePollMutation();

  const form = useForm<CreatePollFormValues>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      title: "",
      code: "",
    },
  });

  const canSubmit =
    form.watch("title").trim().length > 0 &&
    form.watch("code").length === POOL_CODE_LENGTH &&
    !createPollMutation.isPending;

  async function handleCreate(values: CreatePollFormValues) {
    await createPollMutation.mutateAsync({
      title: values.title.trim(),
      code: values.code,
    });
    form.reset();
    onClose();
  }

  function handleClose() {
    if (createPollMutation.isPending) {
      return;
    }
    form.reset();
    onClose();
  }

  function handleGenerateCode() {
    form.setValue("code", generateRandomPoolCode(), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar grupo</DialogTitle>
          <DialogDescription>
            Defina o nome do grupo e um código com 10 letras/números.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit((values) => {
            void handleCreate(values);
          })}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="poll-title">
              Nome do grupo
            </label>
            <Input
              id="poll-title"
              placeholder="Nome do grupo"
              {...form.register("title")}
              aria-invalid={Boolean(form.formState.errors.title)}
            />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="poll-code">
              Código do grupo
            </label>
            <div className="flex gap-2">
              <Input
                id="poll-code"
                placeholder="ABC123DEF4"
                value={form.watch("code")}
                onChange={(event) => {
                  form.setValue("code", sanitizePoolCode(event.target.value), {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                maxLength={POOL_CODE_LENGTH}
                aria-invalid={Boolean(form.formState.errors.code)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateCode}
                disabled={createPollMutation.isPending}
              >
                <RefreshCw aria-hidden="true" data-icon="inline-start" />
                Gerar
              </Button>
            </div>
            {form.formState.errors.code && (
              <p className="text-xs text-destructive">{form.formState.errors.code.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Use exatamente {POOL_CODE_LENGTH} caracteres (A-Z e 0-9).
            </p>
          </div>
        </form>

        {createPollMutation.isError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {createPollMutation.error instanceof Error
              ? createPollMutation.error.message
              : "Erro ao criar grupo"}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={createPollMutation.isPending}>
            Cancelar
          </Button>

          <Button
            type="submit"
            onClick={() => {
              void form.handleSubmit((values) => handleCreate(values))();
            }}
            disabled={!canSubmit}
          >
            {createPollMutation.isPending ? "Criando..." : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
