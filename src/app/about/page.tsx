export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 prose dark:prose-invert prose-blue">
      <h1>About Sejda premium</h1>
      <p className="lead">
        Sejda premium was built with a simple mission: to make document editing free, fast, and completely private.
      </p>
      
      <h2>100% Client-Side Processing</h2>
      <p>
        Most online PDF tools upload your sensitive documents to their servers. We don't. 
        Sejda premium leverages modern web technologies (WebAssembly and advanced JavaScript) to 
        process your files entirely within your web browser. 
      </p>
      <ul>
        <li><strong>Privacy Guaranteed:</strong> Your files never leave your device.</li>
        <li><strong>Lightning Fast:</strong> No waiting for uploads or downloads.</li>
        <li><strong>Reliable:</strong> Works even on slow connections once loaded.</li>
      </ul>

      <h2>Always Free</h2>
      <p>
        We believe basic document manipulation should be a free utility for everyone. 
        There are no hidden subscriptions, no watermarks, and no artificial limits on 
        the core tools we provide.
      </p>

      <h2>Open & Accessible</h2>
      <p>
        Whether you need to quickly merge some invoices, shrink a presentation for email, 
        or extract pages from a massive report, Sejda premium is always here, ready to work 
        instantly without requiring an account.
      </p>
    </div>
  );
}
