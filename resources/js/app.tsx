import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { configureEcho } from '@laravel/echo-react';
import { router } from '@inertiajs/react';
import { registerSW } from 'virtual:pwa-register';

configureEcho({
    broadcaster: 'reverb',
});

registerSW({
  immediate: true,
})

const appName = import.meta.env.VITE_APP_NAME || 'Zenchi Technologies';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // -------------------------
        // WRAPPER COMPONENT
        // -------------------------
        function RootWithLoader() {

            const [globalLoading, setGlobalLoading] = useState(false);

            useEffect(() => {
                const goDashboard = () => {
                    window.location.href = '/dashboard';
                };

                const handleOffline = () => {
                    console.log('OFFLINE → redirecting to dashboard');
                    goDashboard();
                };

                window.addEventListener('offline', handleOffline);

                return () => {
                    window.removeEventListener('offline', handleOffline);
                };
                }, []);

            useEffect(() => {
                router.on('start', () => setGlobalLoading(true));
                router.on('finish', () => setGlobalLoading(false));
            }, []);

            return (
                <>
                    {globalLoading && (
                        <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-md z-[9999]">
                           <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 drop-shadow-lg"></div>
                            <span className="ml-3 text-lg text-gray-700">Loading…</span>
                        </div>
                    )}
                    <App {...props} />
                </>
            );
        }

        root.render(
            <StrictMode>
                <RootWithLoader />
            </StrictMode>
        );
    },
    progress: {
        color: '#4b55631a',
    },
});

initializeTheme();
const updateSW = registerSW({
  immediate: true,
});

