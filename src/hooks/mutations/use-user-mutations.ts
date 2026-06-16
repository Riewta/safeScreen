"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "@/services/user.service";
import { userKeys } from "@/hooks/queries/use-user";
import type { UpdateProfilePayload } from "@/types";

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateUserProfile(payload),
    onSuccess: (updated) => {
      qc.setQueryData(userKeys.profile(), updated);
    },
  });
}
