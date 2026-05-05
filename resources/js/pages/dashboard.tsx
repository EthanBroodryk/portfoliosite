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

const {
    offlineJobCards
} = usePage().props as any;

const [storedJobCards, setStoredJobCards] = useState<any[]>([]);
// const [isOnline, setIsOnline] = useState(true);
const [isOnline, setIsOnline] = useState(navigator.onLine);
useEffect(() => {
    console.log("🧠 EFFECT TRIGGERED", {
        isOnline,
        offlineJobCards
    });

    if (!isOnline) return;

    const sync = async () => {
        console.log("🔄 ENTERED SYNC");

        await clearJobCards();

        console.log("🧹 AFTER CLEAR");

        await new Promise(r => setTimeout(r, 100));

        await saveJobCards(offlineJobCards ?? []);

        console.log("💾 AFTER SAVE");

        const verify = await getOfflineJobCards();

        console.log("📦 FINAL DB:", verify);

        setStoredJobCards(verify);
    };

    sync();
}, [isOnline, offlineJobCards]);



console.log("INITIAL ONLINE STATE:", navigator.onLine);


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


// useEffect(() => {
//     if (isOnline && offlineJobCards) {
//         saveJobCards(offlineJobCards);
//         setStoredJobCards(offlineJobCards);
//     }
// }, [isOnline, offlineJobCards]);





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

            {!isOnline && (
    <div className="mt-4 p-4 border rounded-xl bg-yellow-100">
        <h2 className="text-lg font-bold">Offline Job Cards</h2>
        <table className="w-full mt-2 border-collapse">
            <thead>
                <tr className="bg-gray-200">
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Client</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Date</th>
                </tr>
            </thead>
            <tbody>
                {storedJobCards.map((card: any) => (
                    <tr key={card.id} className="border">
                        <td className="p-2 border">{card.id}</td>
                        <td className="p-2 border">{card.client || "N/A"}</td>
                        <td className="p-2 border">{card.status}</td>
                        <td className="p-2 border">{card.created_at}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}
        </AppLayout>
    );
}
