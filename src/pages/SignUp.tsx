import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, User, Lock, Mail, Loader2, ArrowLeft, Users, Calendar, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { cn } from '../lib/utils';
import axios from 'axios';

const signUpSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  role: z.enum(['PARTICIPANT', 'ORGANIZER']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUp() {
  const navigate = useNavigate();
  const [requestError, setRequestError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: 'PARTICIPANT',
    },
  });

  const selectedRole = watch('role');

  async function handleSignUp(data: SignUpFormData) {
    setRequestError(null);
    try {
      await api.post('/users', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      alert('Conta criada com sucesso!');
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setRequestError(error.response.data.message || 'Erro ao criar conta. Tente novamente.');
      } else {
        setRequestError('Ocorreu um erro inesperado. Verifique sua conexão.');
      }
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm space-y-8 rounded-2xl bg-white p-8 shadow-xl relative">
        <Link to="/" className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
          <ArrowLeft size={24} />
        </Link>
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
            <UserPlus className="h-6 w-6 text-violet-600" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
            Criar Conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Junte-se ao EventSync
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleSignUp)}>
          <div className="space-y-4 rounded-md shadow-sm">
            
            {/* Role Selection */}
            <div className="space-y-2 pb-2">
              <label className="text-sm font-medium text-gray-700">Como você deseja usar o EventSync?</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={cn(
                  "flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50",
                  selectedRole === 'PARTICIPANT' 
                    ? "border-violet-600 bg-violet-50 text-violet-700" 
                    : "border-gray-200 text-gray-500"
                )}>
                  <input type="radio" value="PARTICIPANT" className="hidden" {...register('role')} />
                  <Users className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold">Participante</span>
                </label>
                
                <label className={cn(
                  "flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50",
                  selectedRole === 'ORGANIZER' 
                    ? "border-violet-600 bg-violet-50 text-violet-700" 
                    : "border-gray-200 text-gray-500"
                )}>
                  <input type="radio" value="ORGANIZER" className="hidden" {...register('role')} />
                  <Calendar className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold">Organizador</span>
                </label>
              </div>
            </div>

            {/* Nome */}
            <div className="group relative">
               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                 <User className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
              </div>
              <input
                id="name"
                type="text"
                className={cn(
                  "block w-full rounded-lg border border-gray-300 py-3 pl-10 text-gray-900 placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 sm:text-sm transition-all",
                   errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
                placeholder="Nome Completo"
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                 <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
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
            
            {/* Senha */}
            <div className="group relative">
               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                 <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={cn(
                  "block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 text-gray-900 placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 sm:text-sm transition-all",
                   errors.password && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
                placeholder="Senha (min 6 caracteres)"
                 {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
               {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div className="group relative">
               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                 <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className={cn(
                  "block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 text-gray-900 placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 sm:text-sm transition-all",
                   errors.confirmPassword && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
                placeholder="Confirmar Senha"
                 {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
               {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {requestError && (
            <div className="rounded-md bg-red-50 p-3">
              <div className="flex">
                <div className="text-sm font-medium text-red-800">
                  {requestError}
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
                "Criar Conta"
               )}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-500">Já tem uma conta? </span>
            <Link to="/" className="font-medium text-violet-600 hover:text-violet-500">
              Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
