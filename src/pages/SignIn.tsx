import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, User, Lock, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { cn } from '../lib/utils';
import axios from 'axios';

const signInSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(1, 'A senha é obrigatória'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignIn() {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  async function handleSignIn(data: SignInFormData) {
    setAuthError(null);
    try {
      await signIn(data.email, data.password);
      navigate('/events');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setAuthError(error.response.data.message || 'Credenciais inválidas. Tente novamente.');
      } else {
        setAuthError('Ocorreu um erro ao tentar fazer login. Verifique sua conexão.');
      }
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
            <LogIn className="h-6 w-6 text-violet-600" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
            EventSync
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Faça login para gerenciar seus eventos
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleSignIn)}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                 <User className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={cn(
                  "block w-full rounded-lg border border-gray-300 py-3 pl-10 text-gray-900 placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 sm:text-sm transition-all",
                   errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
                placeholder="E-mail"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <div className="group relative">
               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                 <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className={cn(
                  "block w-full rounded-lg border border-gray-300 py-3 pl-10 text-gray-900 placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 sm:text-sm transition-all",
                   errors.password && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
                placeholder="Senha"
                 {...register('password')}
              />
               {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          {authError && (
            <div className="rounded-md bg-red-50 p-3">
              <div className="flex">
                <div className="text-sm font-medium text-red-800">
                  {authError}
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-violet-600 px-4 py-3 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
               {isSubmitting ? (
                 <Loader2 className="h-5 w-5 animate-spin" />
               ) : (
                "Entrar"
               )}
            </button>
          </div>

          <div className="text-center text-sm">
             <span className="text-gray-500">Não tem uma conta? </span>
             <Link to="/register" className="font-medium text-violet-600 hover:text-violet-500">
               Cadastre-se
             </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
