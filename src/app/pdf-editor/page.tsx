export default function PDFEditorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-violet-500/25 text-2xl text-white">
        ✏️
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">PDF Editor (Coming Soon)</h1>
      <p className="text-xl text-muted-foreground mb-8">
        We're working hard on bringing a full-featured, completely client-side visual PDF editor to DocuFlow. 
      </p>
      <div className="p-8 border border-border rounded-2xl bg-muted/30">
        <h3 className="font-semibold text-lg mb-2">Features coming in the next release:</h3>
        <ul className="text-muted-foreground space-y-2 text-left max-w-sm mx-auto list-disc pl-5">
          <li>Add and edit text directly on the PDF</li>
          <li>Insert images and shapes</li>
          <li>Draw and annotate with highlighters</li>
          <li>Fill out interactive PDF forms</li>
          <li>Add cryptographic signatures</li>
        </ul>
      </div>
    </div>
  );
}
