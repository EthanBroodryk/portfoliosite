import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ReportCountWidget from "@/components/dashboard/ReportCountWidget"; 
import ReportCountByUserWidget from "@/components/dashboard/ReportCountByUserWidget"; 
import { ChartAreaInteractive } from "@/components/dashboard/charts/area-chart";
import { DummyPieChart } from "@/components/dashboard/charts/dummy-pie-chart";
import { usePage} from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { saveJobCards, getOfflineJobCards,clearJobCards} from "@/utils/indexedDbJobCards";
import { useEffect, useState } from "react";
import OfflineJobCards from "@/components/OfflineJobCards";



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {

    const { jobCardCount, completedJobCards, jobCardsByUser } =
    usePage().props as unknown as {
        jobCardCount: number;
        completedJobCards: number;
        jobCardsByUser: any[];
    };

    const { jobCardsByDate } = usePage().props as unknown as {
    jobCardsByDate: {
        date: string
        pending: number
        completed: number
    }[]
    };

    const {
        offlineJobCards
    } = usePage().props as any;

    const [storedJobCards, setStoredJobCards] = useState<any[]>([]);
    const [isOnline, setIsOnline] = useState(navigator.onLine);


    useEffect(() => {
        if (!isOnline) return;

        const sync = async () => {
            await clearJobCards();
            await new Promise(r => setTimeout(r, 100));
            await saveJobCards(offlineJobCards ?? []);
            const verify = await getOfflineJobCards();
            setStoredJobCards(verify);
        };

        sync();
    }, [isOnline, offlineJobCards]);

    useEffect(() => {
        const handleStatusChange = () => {
            setIsOnline(navigator.onLine);
        };

        window.addEventListener("online", handleStatusChange);
        window.addEventListener("offline", handleStatusChange);

        return () => {
            window.removeEventListener("online", handleStatusChange);
            window.removeEventListener("offline", handleStatusChange);
        };
    }, []);

    useEffect(() => {
        if (!isOnline) {
            getOfflineJobCards().then((cards) => {
                console.log("Loaded offline cards:", cards);
                setStoredJobCards(cards);
            });
        }
    }, [isOnline]);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <OfflineJobCards
                    isOnline={isOnline}
                    storedJobCards={storedJobCards}
                />
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

            </div>

     
        </AppLayout>
    );
}
