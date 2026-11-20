import { createFileRoute } from "@tanstack/react-router";
import { HeroBento } from "@/components/home/HeroBento";
import { TrustTicker } from "@/components/home/TrustTicker";
import { CategoryBento } from "@/components/home/CategoryBento";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ValueProps } from "@/components/home/ValueProps";
import { Testimonials } from "@/components/home/Testimonials";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroBento />
      <TrustTicker />
      <CategoryBento />
      <FeaturedProducts />
      <ValueProps />
      <Testimonials />
      <FaqAccordion />
      <NewsletterSignup />
    </div>
  );
}
