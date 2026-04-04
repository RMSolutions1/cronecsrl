import eslintConfigNext from "eslint-config-next"

const nextPluginConfigs = [...eslintConfigNext]

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...nextPluginConfigs,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "scripts/**",
    ],
  },
  {
    rules: {
      // Texto legal y brochure: comillas tipográficas en JSX; escapar rompe legibilidad.
      "react/no-unescaped-entities": "off",
      // Cerrar menú al cambiar ruta / hidratar desde localStorage son patrones válidos; la regla es demasiado estricta en React 19.
      "react-hooks/set-state-in-effect": "off",
      // shadcn sidebar: skeleton con variación visual no crítica.
      "react-hooks/purity": "off",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      "jsx-a11y/alt-text": "warn",
    },
  },
]

export default config
