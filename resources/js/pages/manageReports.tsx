import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import ManageReportCard from '@/components/report_builder/manage-report-card'





export default function ManageReports(){


const breadcrumbs: BreadcrumbItem[] = [
  { title: "Report Builder", href: "/report-builder" },
  { title: "Manage Reports", href: "/manage-reports" }
];


    return (

        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Reports" />
            <div className="flex justify-center items-center w-full h-full py-10">
                <ManageReportCard />
            </div>
        </AppLayout>
    )




}