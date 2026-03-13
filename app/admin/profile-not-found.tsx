"use client"

interface ProfileNotFoundProps {
  userEmail: string
  userId: string
}

export default function ProfileNotFound({ userEmail, userId }: ProfileNotFoundProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Perfil No Encontrado</h1>
        <p className="mb-6 text-gray-600">Tu cuenta está autenticada pero necesita un perfil de administrador.</p>
        <div className="mb-6 rounded-lg bg-blue-50 p-4">
          <p className="mb-2 text-sm text-gray-700">
            <strong>Usuario autenticado:</strong>
          </p>
          <p className="break-all text-sm text-blue-600">{userEmail}</p>
          <p className="mt-1 text-xs text-gray-500">ID: {userId}</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="mb-2 text-sm text-gray-700">
            <strong>Para resolver esto:</strong>
          </p>
          <ol className="list-inside list-decimal space-y-1 text-sm text-gray-600">
            <li>Ve al SQL Editor de Supabase</li>
            <li>Ejecuta este comando:</li>
          </ol>
          <pre className="mt-2 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-gray-100">
            {`INSERT INTO public.profiles (id, email, role, full_name)
VALUES ('${userId}', '${userEmail}', 'superadmin', 'Administrador')
ON CONFLICT (id) DO UPDATE
SET role = 'superadmin';`}
          </pre>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Recargar Página
        </button>
      </div>
    </div>
  )
}
