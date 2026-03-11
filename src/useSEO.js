import { useEffect } from "react";

export default function useSEO({ title, description, canonical }) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} | Zidly` : "Zidly — AI Growth Platform for Dental Practices";

    const desc = document.querySelector('meta[name="description"]');
    const prevDesc = desc?.getAttribute("content");
    if (desc && description) desc.setAttribute("content", description);

    const canon = document.querySelector('link[rel="canonical"]');
    const prevCanon = canon?.getAttribute("href");
    if (canon && canonical) canon.setAttribute("href", `https://zidly.ai${canonical}`);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const prevOgTitle = ogTitle?.getAttribute("content");
    if (ogTitle && title) ogTitle.setAttribute("content", title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    const prevOgDesc = ogDesc?.getAttribute("content");
    if (ogDesc && description) ogDesc.setAttribute("content", description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    const prevOgUrl = ogUrl?.getAttribute("content");
    if (ogUrl && canonical) ogUrl.setAttribute("content", `https://zidly.ai${canonical}`);

    return () => {
      document.title = prev;
      if (desc && prevDesc) desc.setAttribute("content", prevDesc);
      if (canon && prevCanon) canon.setAttribute("href", prevCanon);
      if (ogTitle && prevOgTitle) ogTitle.setAttribute("content", prevOgTitle);
      if (ogDesc && prevOgDesc) ogDesc.setAttribute("content", prevOgDesc);
      if (ogUrl && prevOgUrl) ogUrl.setAttribute("content", prevOgUrl);
    };
  }, [title, description, canonical]);
}
