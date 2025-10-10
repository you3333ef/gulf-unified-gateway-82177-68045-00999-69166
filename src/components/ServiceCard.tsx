import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  titleAr: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
}

const ServiceCard = ({
  title,
  titleAr,
  description,
  icon: Icon,
  href,
  gradient,
}: ServiceCardProps) => {
  return (
    <Card className="group relative overflow-hidden hover:shadow-elevated transition-all duration-300">
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{ background: gradient }}
      />
      
      <div className="relative p-6">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
          style={{ background: gradient }}
        >
          <Icon className="w-7 h-7 text-primary-foreground" />
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {titleAr}
        </h3>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <Link to={href}>
          <Button variant="ghost" className="group/btn p-0 h-auto">
            <span className="ml-2">إنشاء رابط</span>
            <ArrowRight className="w-4 h-4 mr-2 transition-transform group-hover/btn:-translate-x-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ServiceCard;
