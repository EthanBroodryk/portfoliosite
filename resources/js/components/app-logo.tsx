export default function AppLogo() {
    const logoUrl = "/storage/company_logo/obsessiveGenerators.jpg";

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <img src={logoUrl} className="size-5 object-contain" alt="Logo" />
            </div>

            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Obsessive Generators
                </span>
            </div>
        </>
    );
}