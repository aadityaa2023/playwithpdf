export type Tool = {
  slug: string;
  name: string;
  description: string;
  shortDesc: string;
  icon: string;
  category: string;
  color: string;
  gradient: string;
  keywords: string[];
  acceptedFiles: string[];
  popular?: boolean;
};

export type Category = {
  name: string;
  slug: string;
  description: string;
};

export const categories: Category[] = [
  { name: "Most Popular", slug: "popular", description: "Our most used PDF tools" },
  { name: "Merge & Organize", slug: "merge", description: "Combine and arrange PDF files" },
  { name: "Split & Extract", slug: "split", description: "Break PDFs into parts" },
  { name: "Edit & Sign", slug: "edit", description: "Edit and annotate PDF content" },
  { name: "Compress", slug: "compress", description: "Reduce PDF file sizes" },
  { name: "Security", slug: "security", description: "Protect and unlock PDFs" },
  { name: "Convert from PDF", slug: "convert-from", description: "Export PDFs to other formats" },
  { name: "Convert to PDF", slug: "convert-to", description: "Create PDFs from other formats" },
];

export const tools: Tool[] = [
  // Popular
  {
    slug: "pdf-editor",
    name: "PDF Editor",
    description: "Edit PDF files for free. Add text, shapes, images and drawings. Fill and sign PDF forms.",
    shortDesc: "Edit, fill & sign PDF files",
    icon: "✏️",
    category: "edit",
    color: "text-violet-600",
    gradient: "from-violet-500 to-purple-600",
    keywords: ["pdf editor", "edit pdf", "fill pdf", "sign pdf", "annotate pdf"],
    acceptedFiles: ["application/pdf"],
    popular: true,
  },
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDFs and images into one document quickly and easily.",
    shortDesc: "Combine multiple PDFs into one",
    icon: "🔗",
    category: "merge",
    color: "text-blue-600",
    gradient: "from-blue-500 to-cyan-600",
    keywords: ["merge pdf", "combine pdf", "join pdf", "merge pdf files"],
    acceptedFiles: ["application/pdf"],
    popular: true,
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    description: "Split specific page ranges or extract every page into a separate document.",
    shortDesc: "Split a PDF into multiple files",
    icon: "✂️",
    category: "split",
    color: "text-orange-600",
    gradient: "from-orange-500 to-amber-600",
    keywords: ["split pdf", "divide pdf", "separate pdf pages"],
    acceptedFiles: ["application/pdf"],
    popular: true,
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce the size of your PDF while maintaining quality. Fast, free, and easy to use.",
    shortDesc: "Reduce PDF file size",
    icon: "🗜️",
    category: "compress",
    color: "text-green-600",
    gradient: "from-green-500 to-emerald-600",
    keywords: ["compress pdf", "reduce pdf size", "shrink pdf", "optimize pdf"],
    acceptedFiles: ["application/pdf"],
    popular: true,
  },
  {
    slug: "delete-pages",
    name: "Delete PDF Pages",
    description: "Remove specific pages from a PDF document. Select pages visually and delete them instantly.",
    shortDesc: "Remove pages from a PDF",
    icon: "🗑️",
    category: "edit",
    color: "text-red-600",
    gradient: "from-red-500 to-rose-600",
    keywords: ["delete pdf pages", "remove pdf pages", "delete pages from pdf"],
    acceptedFiles: ["application/pdf"],
    popular: true,
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate and save PDF pages permanently. Rotate all pages or just specific ones.",
    shortDesc: "Rotate PDF pages",
    icon: "🔄",
    category: "edit",
    color: "text-teal-600",
    gradient: "from-teal-500 to-cyan-600",
    keywords: ["rotate pdf", "rotate pdf pages", "flip pdf"],
    acceptedFiles: ["application/pdf"],
    popular: true,
  },
  // Merge
  {
    slug: "organize-pdf",
    name: "Organize PDF",
    description: "Arrange and reorder PDF pages. Drag and drop pages to organize your PDF document.",
    shortDesc: "Reorder and rearrange PDF pages",
    icon: "📋",
    category: "merge",
    color: "text-indigo-600",
    gradient: "from-indigo-500 to-blue-600",
    keywords: ["organize pdf", "reorder pdf pages", "rearrange pdf"],
    acceptedFiles: ["application/pdf"],
  },
  // Split & Extract
  {
    slug: "extract-pages",
    name: "Extract Pages",
    description: "Get a new document containing only the desired pages from your PDF.",
    shortDesc: "Extract specific pages from PDF",
    icon: "📄",
    category: "split",
    color: "text-yellow-600",
    gradient: "from-yellow-500 to-orange-600",
    keywords: ["extract pdf pages", "get pages from pdf"],
    acceptedFiles: ["application/pdf"],
  },
  // Security
  {
    slug: "protect-pdf",
    name: "Protect PDF",
    description: "Password protect your PDF files. Add a password and encrypt your PDF document.",
    shortDesc: "Add password protection to PDF",
    icon: "🔒",
    category: "security",
    color: "text-slate-600",
    gradient: "from-slate-500 to-gray-600",
    keywords: ["protect pdf", "password pdf", "encrypt pdf", "lock pdf"],
    acceptedFiles: ["application/pdf"],
  },
  {
    slug: "unlock-pdf",
    name: "Unlock PDF",
    description: "Remove password protection and restrictions from PDF files.",
    shortDesc: "Remove PDF password",
    icon: "🔓",
    category: "security",
    color: "text-amber-600",
    gradient: "from-amber-500 to-yellow-600",
    keywords: ["unlock pdf", "remove pdf password", "decrypt pdf"],
    acceptedFiles: ["application/pdf"],
  },
  {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    description: "Add a text or image watermark to all pages of your PDF document.",
    shortDesc: "Add watermark to PDF",
    icon: "💧",
    category: "edit",
    color: "text-cyan-600",
    gradient: "from-cyan-500 to-blue-600",
    keywords: ["watermark pdf", "add watermark to pdf", "stamp pdf"],
    acceptedFiles: ["application/pdf"],
  },
  // Convert from PDF
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Convert PDF pages to JPG, PNG or TIFF images. High quality conversion, free.",
    shortDesc: "Convert PDF pages to images",
    icon: "🖼️",
    category: "convert-from",
    color: "text-pink-600",
    gradient: "from-pink-500 to-rose-600",
    keywords: ["pdf to jpg", "pdf to image", "pdf to png", "convert pdf to image"],
    acceptedFiles: ["application/pdf"],
  },
  {
    slug: "pdf-to-text",
    name: "PDF to Text",
    description: "Extract all text from your PDF document and save it as a plain text file.",
    shortDesc: "Extract text from PDF",
    icon: "📝",
    category: "convert-from",
    color: "text-lime-600",
    gradient: "from-lime-500 to-green-600",
    keywords: ["pdf to text", "extract text from pdf", "pdf text extractor"],
    acceptedFiles: ["application/pdf"],
  },
  // Convert to PDF
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Convert images (JPG, PNG, WEBP, GIF) to a PDF document in seconds.",
    shortDesc: "Convert images to PDF",
    icon: "📸",
    category: "convert-to",
    color: "text-fuchsia-600",
    gradient: "from-fuchsia-500 to-pink-600",
    keywords: ["jpg to pdf", "image to pdf", "png to pdf", "convert image to pdf"],
    acceptedFiles: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert Microsoft Word DOCX documents to PDF format quickly and easily.",
    shortDesc: "Convert Word documents to PDF",
    icon: "📃",
    category: "convert-to",
    color: "text-blue-700",
    gradient: "from-blue-600 to-indigo-700",
    keywords: ["word to pdf", "docx to pdf", "convert word to pdf", "doc to pdf"],
    acceptedFiles: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"],
  },
];

export const popularTools = tools.filter((t) => t.popular);

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(categorySlug: string): Tool[] {
  return tools.filter((t) => t.category === categorySlug);
}
