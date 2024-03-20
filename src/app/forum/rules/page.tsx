/* eslint-disable react/no-unescaped-entities */
import UserAgreement from "@/components/screens/user-agreement";
import { getServerAuthSession } from "@/server/auth";

export default async function ForumRules() {
  const session = await getServerAuthSession();

  return (
    <section className="container grid items-center gap-6 pb-8 pt-2 md:py-5">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Community Guidelines
        </h1>
      </div>
      <div className="space-y-4">
        <p>
          Be Honest and Constructive: When reviewing food products, honesty is
          key. Share your genuine opinions and experiences, but remember to be
          constructive in your criticism. If you didn't enjoy a product, explain
          why and offer suggestions for improvement. Provide Detailed Reviews:
          The more details you include in your reviews, the more helpful they'll
          be to others. Mention aspects such as taste, texture, packaging, value
          for money, and any special features. Don't forget to specify where you
          purchased the product and its price, if possible. Respectful
          Communication: Treat fellow community members with respect and
          kindness, even if you disagree with their opinions. Healthy
          discussions are encouraged, but personal attacks, offensive language,
          and disrespectful behavior will not be tolerated. Disclosure of
          Relationships: If you have any affiliations with a brand or product
          you're reviewing, please disclose them transparently. This helps
          maintain trust within the community and ensures that reviews are
          unbiased. Avoid Self-Promotion: While we encourage you to share your
          experiences, please refrain from using the forum solely for
          self-promotion or advertising purposes. Any promotional content should
          be relevant to the discussion and add value to the community. Stay
          On-Topic: Keep discussions focused on food product reviews and related
          topics. Off-topic conversations should be taken to appropriate
          sections or forums. Respect Copyright and Intellectual Property: When
          sharing images, recipes, or any other content, ensure you have the
          necessary rights or permissions. Give credit to original sources
          whenever possible.
        </p>
        {session != null && <UserAgreement user={session.user} />}
      </div>
    </section>
  );
}
