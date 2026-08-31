import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="grid min-h-[80svh] place-items-center px-[var(--gutter)] py-24 text-center">
      <div className="max-w-[46ch]">
        <p className="label text-[var(--accent)]">✦ 404</p>
        <h1 className="display mt-5 text-[clamp(2rem,5vw,3.4rem)]">
          There is nothing at this address.
        </h1>
        <p className="body-text mt-5">
          The page you were after has moved or never existed. Both galleries are still where you
          left them.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/campus/" className="btn btn-gold">
            Campus looks
          </Link>
          <Link href="/nysc/" className="btn btn-ghost">
            NYSC looks
          </Link>
        </div>
      </div>
    </section>
  );
}
