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


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

// const sendGpsTest = () => {
//     const timestamp = new Date().toISOString();

//     if (!navigator.geolocation) {
//         router.post("/checkins/gps-test", {
//             latitude: null,
//             longitude: null,
//             timestamp,
//             error: "Geolocation not supported",
//         });
//         return;
//     }

//     navigator.geolocation.getCurrentPosition(
//         (pos) => {
//             router.post("/checkins/gps-test", {
//                 latitude: pos.coords.latitude,
//                 longitude: pos.coords.longitude,
//                 accuracy: pos.coords.accuracy,
//                 timestamp,
//             });
//         },
//         (err) => {
//             router.post("/checkins/gps-test", {
//                 latitude: null,
//                 longitude: null,
//                 timestamp,
//                 error: `GPS failed: ${err.code}`,
//             });
//         },
//         {
//             enableHighAccuracy: false,
//             timeout: 15000,
//             maximumAge: 60000,
//         }
//     );
// };


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


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {/* <button
    onClick={sendGpsTest}
    className="px-4 py-2 bg-blue-600 text-white rounded"
>
    Test GPS
</button> */}

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

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
