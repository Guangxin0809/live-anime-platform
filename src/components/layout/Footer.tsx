export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="container mx-auto flex h-14 items-center justify-center px-4">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} AnimeHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
