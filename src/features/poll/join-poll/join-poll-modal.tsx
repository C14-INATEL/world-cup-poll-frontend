import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useJoinPollMutation } from "@/features/poll/join-poll/use-join-poll-mutation";
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

interface JoinPollModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POLL_CODE_LENGTH = 10;

const joinPollSchema = z.object({
  code: z
    .string()
    .length(POLL_CODE_LENGTH, `O codigo deve ter ${POLL_CODE_LENGTH} caracteres`)
    .regex(/^[A-Z0-9]+$/, "Use apenas letras e numeros"),
});

type JoinPollFormValues = z.infer<typeof joinPollSchema>;

function sanitizePollCode(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, POLL_CODE_LENGTH);
}

export function JoinPollModal({ isOpen, onClose }: JoinPollModalProps) {
  const joinPollMutation = useJoinPollMutation();

  const form = useForm<JoinPollFormValues>({
    resolver: zodResolver(joinPollSchema),
    defaultValues: {
      code: "",
    },
  });

  const code = useWatch({ control: form.control, name: "code" }) ?? "";
  const canSubmit = code.length === POLL_CODE_LENGTH && !joinPollMutation.isPending;

  async function handleJoin(values: JoinPollFormValues) {
    await joinPollMutation.mutateAsync({
      code: values.code,
    });
    toast.success("Voce entrou no grupo!");
    form.reset();
    onClose();
  }

  function handleClose() {
    if (joinPollMutation.isPending) {
      return;
    }
    form.reset();
    onClose();
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
          <DialogTitle>Entrar em grupo</DialogTitle>
          <DialogDescription>
            Informe o codigo de 10 caracteres compartilhado pelo dono do grupo.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit((values) => {
            void handleJoin(values);
          })}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="join-poll-code">
              Codigo do grupo
            </label>
            <Input
              id="join-poll-code"
              placeholder="ABC123DEF4"
              value={code}
              onChange={(event) => {
                form.setValue("code", sanitizePollCode(event.target.value), {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
              maxLength={POLL_CODE_LENGTH}
              aria-invalid={Boolean(form.formState.errors.code)}
              disabled={joinPollMutation.isPending}
            />
            {form.formState.errors.code && (
              <p className="text-xs text-destructive">{form.formState.errors.code.message}</p>
            )}
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={joinPollMutation.isPending}>
            Cancelar
          </Button>

          <Button
            type="submit"
            onClick={() => {
              void form.handleSubmit((values) => handleJoin(values))();
            }}
            disabled={!canSubmit}
          >
            <LogIn aria-hidden="true" data-icon="inline-start" />
            {joinPollMutation.isPending ? "Entrando..." : "Entrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
