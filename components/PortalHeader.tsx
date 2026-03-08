import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

type Props = {
  title: string;
  subtitle: string;
  links: Array<{ href: string; label: string }>;
};

export default function PortalHeader({ title, subtitle, links }: Props) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="shell py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <nav className="flex flex-wrap gap-2">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="btn-secondary h-10 px-4">
                  {link.label}
                </Link>
              ))}
            </nav>
            <SignOutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
