import { Mail, MapPin, Phone } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-[#0B2E6F] text-sm text-white">
      <div className="container-desa flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-4">
          <span className="flex items-center gap-2"><MapPin size={15} /> Jl. Protokol No.27, Rampal Lombo</span>
          <span className="flex items-center gap-2"><Phone size={15} /> (+62) 816-1545-3303</span>
          
        </div>
        <span className="font-medium">Website Resmi Desa</span>
      </div>
    </div>
  );
}
