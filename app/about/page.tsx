import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Button from "@/components/ui/Button";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Sik n Stylish",
  description:
    "Meet Stephanie, the designer behind Sik n Stylish — a bespoke fashion house in Accra, Ghana built on craftsmanship, individuality and timeless elegance.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <PlaceholderImage
            label="Portrait — Stephanie, founder"
            aspect="aspect-[4/5]"
            className="w-full order-1 lg:sticky lg:top-24"
          />
          <div className="flex flex-col gap-6 order-2">
            <SectionHeading
              eyebrow="About the Designer"
              title="Meet Stephanie"
              align="left"
              as="h1"
            />
            <div className="text-ink/70 text-base leading-relaxed flex flex-col gap-4">
              <p>
                Some passions don&rsquo;t begin with a grand plan, they
                quietly reveal themselves over time. Mine began in primary
                school during Clothing and Textiles lessons. While many saw
                it as just another subject, I found myself completely drawn
                to it. The practical side came naturally to me, and I
                genuinely enjoyed creating with my hands. I would often
                finish my own projects early and even help my classmates
                with theirs, sometimes for a small fee. Looking back, that
                may have been my very first business without even realizing
                it.
              </p>
              <p>
                At the time, however, I never imagined becoming a fashion
                designer. Sewing was simply something I loved and happened to
                be good at.
              </p>
              <p>
                Then, in 2020, when the world slowed down during the
                COVID-19 pandemic, I decided to invest my time in learning
                the craft more seriously. What started as a way to stay
                productive quickly became something much bigger. With
                dedicated training, countless hours of practice, and a
                commitment to perfecting every detail, a hobby evolved into
                a purpose.
              </p>
              <p className="font-serif text-xl text-ink not-italic">
                That journey gave birth to SiknStylish.
              </p>
              <p>
                Today, SiknStylish is more than a fashion brand, it&rsquo;s a
                celebration of individuality, craftsmanship, and timeless
                elegance. Every garment is thoughtfully designed and
                meticulously tailored to reflect the personality, confidence,
                and lifestyle of the person wearing it.
              </p>
              <p>
                What began as a childhood passion has grown into a brand
                dedicated to creating bespoke pieces that are as unique as
                the people who wear them.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-ink text-ivory">
        <Container className="flex flex-col gap-6 items-center text-center max-w-3xl mx-auto">
          <span className="text-gold text-xs sm:text-sm uppercase tracking-[0.2em]">
            Design Philosophy
          </span>
          <p className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-snug">
            We believe true luxury lies in individuality. Every SiknStylish
            creation is tailored with precision, crafted with intention, and
            designed to empower confidence through timeless elegance.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col gap-4">
            <h2 className="font-serif text-2xl sm:text-3xl text-ink">
              Our Commitment to Craftsmanship
            </h2>
            <div className="text-ink/70 text-base leading-relaxed flex flex-col gap-4">
              <p>
                At SiknStylish, craftsmanship is at the heart of everything we
                do. Every garment is created with precision, patience, and
                an unwavering attention to detail. From the first
                consultation to the final stitch, we are committed to
                delivering pieces that are impeccably tailored and
                thoughtfully finished.
              </p>
              <p>
                We believe true luxury is found in quality, not quantity.
                That&rsquo;s why every design is made to order, allowing us
                to focus on exceptional construction, premium finishes, and
                a fit that is uniquely yours.
              </p>
              <p>
                Our commitment is simple: to create bespoke garments that
                not only look beautiful but are made to be cherished, worn
                with confidence, and stand the test of time.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-serif text-2xl sm:text-3xl text-ink">
              What Makes Our Work Unique
            </h2>
            <div className="text-ink/70 text-base leading-relaxed flex flex-col gap-4">
              <p>
                At SiknStylish, we don&rsquo;t simply make clothes, every
                piece begins with a conversation, because we believe fashion
                should reflect your personality, lifestyle, and
                individuality. Rather than producing collections in standard
                sizes, each garment is thoughtfully designed and
                meticulously tailored to complement your body, your vision,
                and your confidence.
              </p>
              <p>
                Our approach combines timeless elegance with exceptional
                craftsmanship, ensuring every detail — from the choice of
                fabric to the finishing touches — is executed with care and
                precision.
              </p>
              <p>
                For us, luxury is personal. It is about creating pieces that
                fit beautifully, feel exceptional, and leave a lasting
                impression long after they&rsquo;re worn.
              </p>
              <p>
                When you choose SiknStylish, you&rsquo;re not just investing
                in clothing, you&rsquo;re investing in a bespoke experience
                crafted exclusively for you.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-ink/[0.02]">
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
