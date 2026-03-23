import { Github, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="relative bg-black/80 backdrop-blur-md px-6 py-6 mt-12">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <span className="text-xs text-zinc-500 tracking-wide">
          built with ❤️ for maths and machines
        </span>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/anubhavitis/web-playground"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400 transition-all hover:border-emerald-500/30 hover:text-emerald-400 hover:shadow-[0_0_8px_rgba(0,255,65,0.1)]"
          >
            <Github className="h-3.5 w-3.5" />
            Source
          </a>
          <Separator orientation="vertical" className="h-4 bg-zinc-800" />
          <a
            href="https://x.com/anubhavitis"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400 transition-all hover:border-emerald-500/30 hover:text-emerald-400 hover:shadow-[0_0_8px_rgba(0,255,65,0.1)]"
          >
            <Twitter className="h-3.5 w-3.5" />
            @anubhavitis
          </a>
        </div>
      </div>
    </footer>
  );
}
