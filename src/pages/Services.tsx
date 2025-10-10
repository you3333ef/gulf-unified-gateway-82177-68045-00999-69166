import { useState } from "react";
import { Home, Package, FileText, Heart, Truck, Building2 } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { Country, COUNTRIES } from "@/lib/countries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Services = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();

  const services = [
    {
      title: "Chalet Booking",
      titleAr: "حجز الشاليهات",
      description: "احجز شاليه أحلامك بأسعار مخصصة",
      icon: Home,
      href: selectedCountry ? `/create/${selectedCountry.code}/chalet` : "#",
      gradient: "var(--gradient-primary)",
    },
    {
      title: "Shipping Services",
      titleAr: "خدمات الشحن",
      description: "شحن سريع وآمن مع شركات محلية معتمدة",
      icon: Package,
      href: selectedCountry ? `/create/${selectedCountry.code}/shipping` : "#",
      gradient: "var(--gradient-success)",
    },
    {
      title: "Invoices",
      titleAr: "الفواتير",
      description: "إنشاء وإدارة الفواتير بسهولة",
      icon: FileText,
      href: "#",
      gradient: "linear-gradient(135deg, hsl(210 95% 50%), hsl(220 90% 60%))",
    },
    {
      title: "Health Services",
      titleAr: "الخدمات الصحية",
      description: "خدمات طبية وصحية معتمدة",
      icon: Heart,
      href: "#",
      gradient: "linear-gradient(135deg, hsl(0 85% 55%), hsl(10 80% 60%))",
    },
    {
      title: "Logistics",
      titleAr: "الخدمات اللوجستية",
      description: "حلول لوجستية متكاملة",
      icon: Truck,
      href: "#",
      gradient: "linear-gradient(135deg, hsl(260 95% 55%), hsl(280 90% 60%))",
    },
    {
      title: "Contracts",
      titleAr: "العقود",
      description: "إدارة وتوثيق العقود الإلكترونية",
      icon: Building2,
      href: "#",
      gradient: "linear-gradient(135deg, hsl(40 95% 55%), hsl(30 90% 50%))",
    },
  ];

  const handleCountryChange = (countryCode: string) => {
    const country = COUNTRIES.find((c) => c.code === countryCode);
    setSelectedCountry(country);
  };

  return (
    <div className="min-h-screen py-12" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            اختر خدمتك
          </h1>
          <p className="text-lg text-muted-foreground">
            ابدأ بتحديد الدولة، ثم اختر الخدمة المناسبة
          </p>
        </div>

        {/* Country Dropdown */}
        <div className="mb-12">
          <div className="max-w-md mx-auto">
            <label className="block text-lg font-semibold mb-3 text-center">
              اختر الدولة
            </label>
            <Select onValueChange={handleCountryChange}>
              <SelectTrigger className="w-full h-14 text-lg bg-card/50 backdrop-blur-sm border-2 hover:border-primary transition-colors">
                <SelectValue placeholder="اختر دولة..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {COUNTRIES.map((country) => (
                  <SelectItem
                    key={country.code}
                    value={country.code}
                    className="text-lg py-3 cursor-pointer hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{country.flag}</span>
                      <div className="text-right">
                        <div className="font-semibold">{country.nameAr}</div>
                        <div className="text-sm text-muted-foreground">
                          {country.name}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Services Grid */}
        {selectedCountry ? (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-8 text-center">
              الخدمات المتاحة في {selectedCountry.nameAr}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {services.map((service) => (
                <ServiceCard key={service.title} {...service} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <Package className="w-12 h-12 text-primary-foreground" />
            </div>
            <p className="text-xl text-muted-foreground">
              الرجاء اختيار دولة لعرض الخدمات المتاحة
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
