"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  const hideFooter = pathname === "/pdf-editor";

  if (hideFooter) return null;

  return <Footer />;
}
