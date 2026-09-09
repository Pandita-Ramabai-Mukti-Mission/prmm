import Link from "next/link";

export default async function DonateThankYou({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; amount?: string; txnid?: string; reason?: string }>;
}) {
  const { status, amount, txnid, reason } = await searchParams;

  if (status === "success") {
    return (
      <main id="main-content" className="mx-auto w-full max-w-2xl flex-1 px-6 py-16 text-center sm:px-12">
        <h1 className="text-3xl">Thank you for your gift</h1>
        <p className="mt-4 text-ink-soft">
          {amount && <>Your donation of &#8377;{amount} </>}
          has been received. A receipt will be emailed to you shortly.
        </p>
        {txnid && <p className="mt-2 text-xs text-ink-soft">Reference: {txnid}</p>}
        <Link href="/" className="mt-6 inline-block text-coral hover:text-coral-dark">
          &larr; Back to Home
        </Link>
      </main>
    );
  }

  return (
    <main id="main-content" className="mx-auto w-full max-w-2xl flex-1 px-6 py-16 text-center sm:px-12">
      <h1 className="text-3xl">We couldn&rsquo;t complete your donation</h1>
      <p className="mt-4 text-ink-soft">
        {reason === "not_configured" && "The payment gateway isn't fully configured yet. "}
        {reason === "hash_mismatch" && "We couldn't verify this payment response. "}
        Please try again, or contact us if the problem continues.
      </p>
      <Link href="/donate/" className="mt-6 inline-block text-coral hover:text-coral-dark">
        &larr; Back to Donate
      </Link>
    </main>
  );
}
