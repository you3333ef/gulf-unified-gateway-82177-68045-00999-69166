import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePayment, useUpdatePayment } from "@/hooks/useSupabase";
import { Shield, AlertCircle, Check, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentOTP = () => {
  const { id, paymentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: payment, refetch } = usePayment(paymentId);
  const updatePayment = useUpdatePayment();
  
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  
  useEffect(() => {
    if (payment?.locked_until) {
      const lockTime = new Date(payment.locked_until).getTime();
      const now = Date.now();
      
      if (now < lockTime) {
        setIsLocked(true);
        setError("تم حظر عملية الدفع مؤقتاً لأسباب أمنية.");
      } else {
        setIsLocked(false);
      }
    }
  }, [payment]);
  
  const handleSubmit = async () => {
    if (!payment || isLocked) return;
    
    setError("");
    
    // Check if OTP matches
    if (otp === payment.otp) {
      // Success!
      await updatePayment.mutateAsync({
        paymentId: payment.id,
        updates: {
          status: "confirmed",
          receipt_url: `/pay/${id}/receipt/${payment.id}`,
        },
      });
      
      toast({
        title: "تم بنجاح!",
        description: "تم تأكيد الدفع بنجاح",
      });
      
      navigate(`/pay/${id}/receipt/${payment.id}`);
    } else {
      // Wrong OTP
      const newAttempts = payment.attempts + 1;
      
      if (newAttempts >= 3) {
        // Lock for 15 minutes
        const lockUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        
        await updatePayment.mutateAsync({
          paymentId: payment.id,
          updates: {
            attempts: newAttempts,
            locked_until: lockUntil,
          },
        });
        
        setIsLocked(true);
        setError("تم حظر عملية الدفع مؤقتاً لأسباب أمنية.");
        
        toast({
          title: "تم الحظر",
          description: "لقد تجاوزت عدد المحاولات المسموحة",
          variant: "destructive",
        });
      } else {
        // Increment attempts
        await updatePayment.mutateAsync({
          paymentId: payment.id,
          updates: {
            attempts: newAttempts,
          },
        });
        
        setError(`رمز التحقق غير صحيح. حاول مرة أخرى. (${3 - newAttempts} محاولات متبقية)`);
        refetch();
      }
    }
  };
  
  // FOR TESTING: Display actual OTP (remove in production)
  useEffect(() => {
    if (payment?.otp) {
      console.log("🔐 OTP للاختبار:", payment.otp);
    }
  }, [payment]);
  
  return (
    <div className="min-h-screen py-4 sm:py-12 bg-gradient-to-b from-background to-secondary/20" dir="rtl">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-md mx-auto">
          {/* Security Badge */}
          <div className="text-center mb-3 sm:mb-6">
            <Badge className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-success">
              <Lock className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
              <span>التحقق الآمن</span>
            </Badge>
          </div>
          
          <Card className="p-4 sm:p-8 shadow-elevated">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-lg sm:rounded-xl flex items-center justify-center animate-pulse-glow">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">رمز التحقق</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">أدخل الرمز المرسل</p>
              </div>
            </div>
            
            {/* Info */}
            <div className="bg-secondary/30 p-3 sm:p-4 rounded-md sm:rounded-lg mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-muted-foreground">
                تم إرسال رمز التحقق إلى هاتفك المسجل في البنك. الرجاء إدخاله أدناه.
              </p>
            </div>
            
            {/* Testing Note */}
            {payment?.otp && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-md sm:rounded-lg p-2 sm:p-3 mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-amber-500">
                  <strong>للاختبار فقط:</strong> رمز OTP = {payment.otp}
                </p>
              </div>
            )}
            
            {/* OTP Input */}
            <div className="mb-4 sm:mb-6">
              <Input
                placeholder="----"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                className="h-12 sm:h-16 text-center text-2xl sm:text-3xl tracking-widest font-bold"
                disabled={isLocked}
                maxLength={4}
              />
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md sm:rounded-lg p-2 sm:p-3 mb-4 sm:mb-6 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-destructive">{error}</p>
              </div>
            )}
            
            {/* Attempts Counter */}
            {payment && payment.attempts > 0 && !isLocked && (
              <div className="text-center mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  المحاولات المتبقية: <strong>{3 - payment.attempts}</strong>
                </p>
              </div>
            )}
            
            {/* Submit Button */}
            <Button
              size="lg"
              className="w-full text-sm sm:text-lg py-5 sm:py-7"
              onClick={handleSubmit}
              disabled={updatePayment.isPending || isLocked || otp.length < 4}
            >
              {updatePayment.isPending ? (
                <span>جاري التحقق...</span>
              ) : isLocked ? (
                <span>محظور مؤقتاً</span>
              ) : (
                <>
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  <span>تأكيد</span>
                </>
              )}
            </Button>
            
            <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-3 sm:mt-4">
              لم تستلم الرمز؟ تحقق من رسائلك أو اتصل بالبنك
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentOTP;
