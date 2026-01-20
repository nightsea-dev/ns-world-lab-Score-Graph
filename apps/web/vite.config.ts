import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
// import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite"

const toPort = (v: string | undefined, fallback: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
};

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "VITE_")

        , vite_host = env.VITE_HOST ?? "0.0.0.0"
        , vite_port = toPort(env.VITE_PORT, 5173)

        , graph_api_host = env.VITE_GRAPH_API_HOST ?? "localhost"
        , graph_api_port = toPort(env.VITE_GRAPH_API_PORT, 3001)
        , graph_api_target = `http://${graph_api_host}:${graph_api_port}`
        , graph_api_base = env.VITE_GRAPH_API_BASE ?? "/api"

    return {
        plugins: [
            react(),
            // tsconfigPaths({ projects: ["./tsconfig.json"] })
            tailwindcss(),
        ],
        server: {
            host: vite_host,
            port: vite_port,
            proxy: {
                [graph_api_base]: {
                    target: graph_api_target
                    , changeOrigin: true
                }
            }
        }
    };
});
