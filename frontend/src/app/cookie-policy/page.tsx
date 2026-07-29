import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - GoTot",
  description: "GoTot Cookie Policy — Learn about how we use cookies and tracking technologies.",
  openGraph: {
    title: "Cookie Policy - GoTot",
    description: "GoTot Cookie Policy — Learn about how we use cookies and tracking technologies.",
    type: "website",
    url: "https://gotot.app/cookie-policy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy - GoTot",
    description: "GoTot Cookie Policy — Learn about how we use cookies and tracking technologies.",
  },
  alternates: {
    canonical: "https://gotot.app/cookie-policy",
  },
};

export default function CookiePolicyPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-400">
          <p>Last updated: July 23, 2026</p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">1. What Are Cookies</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They are widely used to make websites work efficiently and provide information to site owners.</p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">2. How GoTot Uses Cookies</h2>
          <p>GoTot uses cookies for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for the website to function properly, including session management and security.</li>
            <li><strong>Preference Cookies:</strong> Remember your settings such as dark/light mode preference and language selection.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site by collecting anonymized usage data.</li>
            <li><strong>Advertising Cookies:</strong> Used to deliver relevant ads and measure ad campaign effectiveness (only if you consent).</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">3. Managing Cookies</h2>
          <p>You can control and/or delete cookies at any time. You can set your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of our site may not function properly without cookies.</p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">4. Third-Party Cookies</h2>
          <p>Our site uses third-party services that set their own cookies, including Google Analytics for analytics, Google AdSense for advertising, and Razorpay for payment processing. These third parties have their own privacy policies.</p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">5. Changes to This Policy</h2>
          <p>We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated revision date.</p>

          <p>For questions about our cookie practices, contact us at <a href="/contact" className="text-primary-600 hover:underline">contact@gotot.app</a>.</p>
        </div>
      </div>
    </div>
  );
}