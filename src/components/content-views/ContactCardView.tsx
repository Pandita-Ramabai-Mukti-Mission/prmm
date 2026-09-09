export function ContactCardView({
  region,
  name,
  address,
  phone,
  email,
}: {
  region: string;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}) {
  return (
    <div className="rounded-lg border border-black/10 bg-white shadow-md p-5">
      <h3 className="font-semibold">{region}</h3>
      {name && <p className="mt-2 text-sm text-ink-soft">{name}</p>}
      {address && <p className="mt-0.5 text-sm text-ink-soft">{address}</p>}
      {(phone || email) && (
        <p className="mt-0.5 text-sm text-ink-soft">
          {phone}
          {phone && email && " · "}
          {email}
        </p>
      )}
    </div>
  );
}
