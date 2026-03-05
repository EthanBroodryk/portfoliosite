import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link,router } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid,Upload, FileText, Package, Plus, Boxes, Warehouse,  User, Users, ArrowDownCircle  } from 'lucide-react';



import AppLogo from './app-logo';


// interface fileProps {

//     files:{
//         file:any[]
//     }

// }


export async function getFiles(): Promise<NavItem[]> {
    try {
        const response = await axios.get('/api/reports');
        return response.data.map((file: any) => ({
            ...file,
            icon: FileText,
        }));
        
    } catch (error) {
        console.error('Error fetching files:', error);
        return [];
    }
}

export function AppSidebar() {
  
    const [reportsSubmenu, setReportsSubmenu] = useState<NavItem[]>([]);
    useEffect(() => {
    getFiles().then((files) => {
        const transformed = files.map((file) => ({
            ...file,
            onClick: () => {
                router.visit(`/report-builder?file=${encodeURIComponent(file.title)}`);
            },
            href: undefined, 
        }));
        setReportsSubmenu(transformed);
    });
}, []);


    const reportBuilderSubmenu: NavItem[] = [
        { title: 'Import Data', href: '/data', icon: Upload },
        {
            title: 'Reports',
            href: '#',
            icon: FileText,
            children: reportsSubmenu,
        },
        {
            title: 'Manage Reports',
            href: '/manage-reports',
            icon: FileText,
        },
    ];

const InventorySubmenu: NavItem[] = [
    {
        title: 'Products',
        href: '#',
        icon: Package,
        children: [
            { title: 'All Products', href: '/products', icon: Boxes },
            { title: 'Add Product', href: '/products/create', icon: Plus },
        ],
    },

    {
        title: 'Stock',
        href: '#',
        icon: Warehouse,
        children: [
            { title: 'Stock Movements', href: '/stock', icon: FileText },
            { title: 'Add Stock', href: '/stock/create', icon: Plus },
            { title: 'Receiving', href: '/stock/receiving', icon: ArrowDownCircle },
        ],
    },
    {
        title: 'Suppliers',
        href: '#',
        icon: Warehouse,
        children: [
            { title: 'Manage Suppliers', href: '/suppliers', icon: FileText },
    
        ],
    },

    {
        title: 'POS',
        href: '#',
        icon: LayoutGrid, // you can pick a POS-related icon
        children: [
            { title: 'Sales', href: '/pos/sales', icon: FileText },
            { title: 'Create Sale', href: '/pos/create', icon: Plus },
            { title: 'Receipts', href: '/pos/receipts', icon: FileText },
        ],
    },


];


//Admin submenu
    const adminSubmenu: NavItem[] = [
        { title: "Manage Users", href: "/admin/users", icon: User },
        { title: "Manage Branches", href: "/admin/branches", icon: Warehouse },
    ];

    const customerSubmenu: NavItem[] = [

        {title:"Add Customer",href:"/customer/add",icon: Users},
    ]



    const mainNavItems: NavItem[] = [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },

        {
            title: 'Report Builder',
            href: '#',
            icon: Upload,
            children: reportBuilderSubmenu,
        },

        {
            title: 'Inventory',
            href: '#',
            icon: Package,
            children: InventorySubmenu,
        },
        {
            title:'Customer Management',
            href: '#',
            icon:Users,
            children:customerSubmenu,

        },
        {
            title: "Admin",
            href: "#",
            icon: User,
            children: adminSubmenu,
        },


    ];


    const footerNavItems: NavItem[] = [
        { title: 'Repository', href: 'https://github.com/laravel/react-starter-kit', icon: Folder },
        { title: 'Documentation', href: 'https://laravel.com/docs/starter-kits#react', icon: BookOpen },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
