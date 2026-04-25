import { ReactNode } from 'react';

type SectionShellProps = {
  id: string;
  kicker: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function SectionShell({ id, kicker, title, description, children }: SectionShellProps) {
  return (
    <section id={id} className="container-shell py-16 md:py-24">
      <div className="mb-10 max-w-3xl">
        <p className="section-kicker">{kicker}</p>
        <h2 className="section-title mt-3">{title}</h2>
        {description ? <p className="mt-4 text-slate-300 md:text-lg">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
