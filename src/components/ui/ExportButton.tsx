import { Shield, Users, Download } from "lucide-react";
import { Officer } from "@/types/officer";

interface ExportButtonProps {
    officers: Officer[];
    filename?: string;
}

export default function ExportButton({ officers, filename = "ondo_admin_directory.csv" }: ExportButtonProps) {
    const handleExport = () => {
        if (!officers.length) return;

        // Define CSV headers
        const headers = [
            "Full Name",
            "MDA",
            "Grade Level",
            "LGA",
            "Birthday",
            "Phone Number",
            "Email Address",
            "Hobbies",
            "About Me"
        ];

        // Map officers data to rows
        const rows = officers.map(officer => [
            `"${officer.full_name}"`,
            `"${officer.current_mda}"`,
            `"${officer.grade_level}"`,
            `"${officer.lga}"`,
            `"${officer.birth_month_day}"`,
            `"${officer.phone_number}"`,
            `"${officer.email_address}"`,
            `"${officer.hobbies}"`,
            `"${officer.about_me?.replace(/"/g, '""') || ''}"` // Escape quotes in long text
        ]);

        // Combine headers and rows
        const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

        // Create blob and force download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={handleExport}
            disabled={officers.length === 0}
            className="flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 border border-green-200 shadow-sm hover:shadow-md transition-all duration-300 font-semibold text-sm px-4 py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            title="Export to CSV Spreadsheet"
        >
            <Download size={16} />
            <span className="hidden sm:inline">Export CSV</span>
        </button>
    );
}
