import { userQueryKeys } from "@/entities/user/api/query-keys";
import { useCurrentUserQuery } from "@/entities/user/use-current-user-query";
import { type User, type UserLogin, type UserRegister } from "@/entities/user/types";
import { useLoginMutation, useRegisterMutation } from "@/features/auth";
import { api, registerLogoutCallback } from "@/shared/api/api";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<User | null>(null);
  const { data: currentUser, isPending, isFetching, isError } = useCurrentUserQuery();

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  const login = useCallback(async (input: UserLogin) => {
    const authenticatedUser = await loginMutation.mutateAsync(input);
    setUser(authenticatedUser);
    queryClient.setQueryData(userQueryKeys.me, authenticatedUser);
  }, [loginMutation, queryClient]);

  const register = useCallback(async (input: UserRegister) => {
    const authenticatedUser = await registerMutation.mutateAsync(input);
    setUser(authenticatedUser);
    queryClient.setQueryData(userQueryKeys.me, authenticatedUser);
  }, [queryClient, registerMutation]);

  const clearSession = useCallback(() => {
    setUser(null);
    queryClient.setQueryData(userQueryKeys.me, null);
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await api.post<void>(ENDPOINTS.auth.logout);
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    registerLogoutCallback(clearSession);
  }, [clearSession]);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      return;
    }

    if (isError) {
      setUser(null);
    }
  }, [currentUser, isError]);

  const isAuthLoading = isPending || isFetching || loginMutation.isPending || registerMutation.isPending;

  const value = useMemo(
    () => ({
      login,
      register,
      logout,
      user,
      isAuthLoading,
    }),
    [isAuthLoading, login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
