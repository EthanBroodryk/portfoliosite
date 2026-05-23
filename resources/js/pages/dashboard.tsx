import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

import ReportCountWidget from "@/components/dashboard/ReportCountWidget";
import ReportCountByUserWidget from "@/components/dashboard/ReportCountByUserWidget";
import { ChartAreaInteractive } from "@/components/dashboard/charts/area-chart";
import { DummyPieChart } from "@/components/dashboard/charts/dummy-pie-chart";
import OfflineJobCards from "@/components/OfflineJobCards";

import { useEffect, useState } from "react";
import { saveJobCards, getOfflineJobCards } from "@/utils/indexedDbJobCards";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const {
        jobCardCount,
        completedJobCards,
        jobCardsByUser,
        jobCardsByDate,
        offlineJobCards
    } = usePage().props as any;

    const [storedJobCards, setStoredJobCards] = useState<any[]>([]);
    const [isOnline, setIsOnline] = useState<boolean>(true);
    const showOffline = !isOnline || storedJobCards.length > 0;

    useEffect(() => {
    const load = async () => {
        const local = await getOfflineJobCards();
        setStoredJobCards(local);
    };

    load();
}, []);



    // -----------------------------
    // ONLINE / OFFLINE LISTENER
    // -----------------------------
    useEffect(() => {
        const update = () => setIsOnline(navigator.onLine);

        window.addEventListener("online", update);
        window.addEventListener("offline", update);

        return () => {
            window.removeEventListener("online", update);
            window.removeEventListener("offline", update);
        };
    }, []);

    // -----------------------------
    // SYNC WHEN BACK ONLINE
    // -----------------------------
    useEffect(() => {
        if (!isOnline) return;

        const sync = async () => {
            if (offlineJobCards?.length) {
                await saveJobCards(offlineJobCards);
            }

            const local = await getOfflineJobCards();
            setStoredJobCards(local);
        };

        sync();
    }, [isOnline, offlineJobCards]);

    // -----------------------------
    // LOAD FROM INDEXEDDB WHEN OFFLINE
    // -----------------------------
    useEffect(() => {
        if (isOnline) return;

        getOfflineJobCards().then(setStoredJobCards);
    }, [isOnline]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isOnline ? "Dashboard" : "Dashboard (Offline)"} />

            <div className="p-4 space-y-4">

                {/* =========================
                    OFFLINE VIEW ONLY
                ========================== */}
                {!isOnline && (
                    <>
                        <div className="rounded bg-yellow-200 text-yellow-900 p-3">
                            You are offline. Showing local job cards only.
                        </div>

                      {showOffline && (
  <OfflineJobCards
    isOnline={isOnline}
    storedJobCards={storedJobCards}
  />
)}
                    </>
                )}

                {/* =========================
                    ONLINE DASHBOARD VIEW
                ========================== */}
                {isOnline && (
                    <>
                        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                            <ReportCountWidget count={jobCardCount} />
                            <ReportCountByUserWidget count={completedJobCards} />

                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <DummyPieChart data={jobCardsByUser} />
                            </div>
                        </div>

                        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                            <ChartAreaInteractive data={jobCardsByDate} />
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}