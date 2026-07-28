import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Button from "@/components/ui/Button";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Sik n Stylish",
  description:
    "Meet the designer behind Sik n Stylish — a bespoke fashion house in Accra, Ghana built on craftsmanship, fit and design philosophy.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <PlaceholderImage
            label="Portrait — Stephanie, founder"
            aspect="aspect-[4/5]"
            className="w-full order-1"
          />
          <div className="flex flex-col gap-6 order-2">
            <SectionHeading
              eyebrow="About the Designer"
              title="Meet Stephanie"
              align="left"
            />
            <div className="text-ink/70 text-base leading-relaxed flex flex-col gap-4">
              <p>
                [PLACEHOLDER — replace with Stephanie&rsquo;s real story: why
                she started Sik n Stylish, her background in fashion, and the
                moment that shaped her design philosophy.]
              </p>
              <p>
                [PLACEHOLDER — replace with her point of view on bespoke
                fashion: what she believes great tailoring should feel like,
                and how she works with clients from first sketch to final
                fitting.]
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-ink text-ivory">
        <Container className="flex flex-col gap-12">
          <div className="max-w-2xl mx-auto text-center flex flex-col gap-4">
            <span className="text-gold text-xs sm:text-sm uppercase tracking-[0.2em]">
              Design Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl leading-tight">
              Craftsmanship, Fit, and Individuality
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col gap-2">
              <h3 className="font-serif text-xl text-gold">Craftsmanship</h3>
              <p className="text-ivory/70 text-sm leading-relaxed">
                [PLACEHOLDER — describe your commitment to hand-finishing,
                quality fabrics, and construction standards.]
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-serif text-xl text-gold">Fit</h3>
              <p className="text-ivory/70 text-sm leading-relaxed">
                [PLACEHOLDER — describe how precise measurement and fittings
                shape every garment.]
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-serif text-xl text-gold">Individuality</h3>
              <p className="text-ivory/70 text-sm leading-relaxed">
                [PLACEHOLDER — describe what makes your work unique compared
                to ready-to-wear fashion.]
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="flex flex-col items-center text-center gap-6">
          <h2 className="font-serif text-2xl sm:text-3xl text-ink">
            Ready to Design Something of Your Own?
          </h2>
          <Button href="/book" variant="primary">
            Start Your Custom Order
          </Button>
        </Container>
      </section>
    </>
  );
}
