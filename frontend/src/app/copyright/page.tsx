import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Copyright Policy - GoTot",
  description: "GoTot Copyright Policy — respecting intellectual property and complying with copyright laws.",
  openGraph: {
    title: "Copyright Policy - GoTot",
    description: "GoTot Copyright Policy — respecting intellectual property and complying with copyright laws.",
    type: "website",
    url: "https://gotot.app/copyright",
  },
  twitter: {
    card: "summary_large_image",
    title: "Copyright Policy - GoTot",
    description: "GoTot Copyright Policy — respecting intellectual property and complying with copyright laws.",
  },
  alternates: {
    canonical: "https://gotot.app/copyright",
  },
};

export default function CopyrightPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-2">Copyright Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: July 23, 2026</p>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-400">
          <section aria-labelledby="scope-heading">
            <h2 id="scope-heading" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">1. Scope</h2>
            <p>This policy applies to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>User submitted content</li>
              <li>Download links</li>
              <li>Metadata</li>
              <li>Embedded content</li>
              <li>Uploaded files</li>
              <li>Shared content</li>
              <li>Public URLs</li>
              <li>API submissions</li>
              <li>Third-party integrations</li>
              <li>Any material available through GoTot.</li>
            </ul>
          </section>

          <section aria-labelledby="third-party-heading">
            <h2 id="third-party-heading" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">2. Third Party Content Disclaimer</h2>
            <p>GoTot does not host copyrighted videos or media on its own servers.</p>
            <p>GoTot is owned and operated by tenishraj.</p>
            <p>GoTot acts as a neutral software tool that facilitates downloading publicly accessible content from third-party platforms.</p>
            <p>Users are solely responsible for ensuring that their use complies with applicable copyright laws and the Terms of Service of the source platform.</p>
          </section>

          <section aria-labelledby="reporting-heading">
            <h2 id="reporting-heading" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">3. Reporting Copyright Infringement</h2>
            <p>If you are a copyright owner or an agent thereof and believe that any content accessible through GoTot infringes your copyright, please submit a written notice to our Designated Copyright Agent with the following information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Full legal name of the copyright owner</li>
              <li>Company name (if applicable)</li>
              <li>Contact email address</li>
              <li>Phone number</li>
              <li>Physical mailing address</li>
              <li>Identification of the copyrighted work</li>
              <li>Description of the copyrighted work</li>
              <li>Original URL of the copyrighted work</li>
              <li>URL of the infringing material on GoTot</li>
              <li>A statement that you have a good-faith belief that the use is not authorized</li>
              <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner</li>
              <li>Electronic or physical signature</li>
            </ul>
            <p className="mt-4">
              Email: <a href="mailto:dmca@gotot.app" className="text-primary-600 hover:underline font-medium">dmca@gotot.app</a>
            </p>
          </section>

          <section aria-labelledby="counter-heading">
            <h2 id="counter-heading" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">4. Counter Notification Procedure</h2>
            <p>If you believe that material you posted was removed or access to it was disabled by mistake or misidentification, you may file a counter-notification with us. Your counter-notification must include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your physical or electronic signature</li>
              <li>Identification of the material that has been removed and the location where it appeared</li>
              <li>A statement under penalty of perjury that you have a good-faith belief the material was removed or disabled as a result of mistake or misidentification</li>
              <li>Your name, address, and telephone number</li>
              <li>A statement that you consent to the jurisdiction of the federal court in your district</li>
            </ul>
            <p className="mt-4">Submit counter-notifications to: <a href="mailto:dmca@gotot.app" className="text-primary-600 hover:underline">dmca@gotot.app</a></p>
            <p className="mt-4">Upon receipt of a valid counter-notification, we will forward it to the original complaining party and may restore the removed material within 10–14 business days unless the copyright owner files an action seeking a court order against you.</p>
          </section>

          <section aria-labelledby="repeat-heading">
            <h2 id="repeat-heading" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">5. Repeat Infringer Policy</h2>
            <p>GoTot maintains a repeat infringer policy. Accounts that receive three valid DMCA notices within a rolling 12-month period may face:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A warning for the first valid notice</li>
              <li>Temporary suspension of download privileges for the second valid notice</li>
              <li>Permanent account termination for the third valid notice</li>
            </ul>
            <p className="mt-4">Users may appeal any action by submitting a written appeal to <a href="mailto:dmca@gotot.app" className="text-primary-600 hover:underline">dmca@gotot.app</a> with supporting evidence.</p>
          </section>

          <section aria-labelledby="dmca-agent-heading">
            <h2 id="dmca-agent-heading" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">6. Designated DMCA Agent</h2>
            <p>GoTot maintains a designated DMCA Agent. Contact information:</p>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg my-4">
              <p className="font-medium">GoTot DMCA Agent</p>
              <p>Email: <a href="mailto:dmca@gotot.app" className="text-primary-600 hover:underline">dmca@gotot.app</a></p>
            </div>
          </section>

          <section aria-labelledby="changes-heading">
            <h2 id="changes-heading" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">7. Changes to This Policy</h2>
            <p>GoTot may update this policy periodically. Material changes may be announced through website notices, email (where applicable), and dashboard notifications.</p>
            <p className="mt-2">Last Updated: July 23, 2026</p>
          </section>

          <section aria-labelledby="registration-heading">
            <h2 id="registration-heading" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">8. Copyright Registration Notice</h2>
            <p>To maximize DMCA Safe Harbor protections, GoTot intends to maintain a designated DMCA Agent and encourages registration with the U.S. Copyright Office where applicable.</p>
          </section>

          <section aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">9. Contact</h2>
            <p>For copyright-related inquiries, DMCA notices, counter-notifications, or to report infringement, contact us at <a href="mailto:dmca@gotot.app" className="text-primary-600 hover:underline">dmca@gotot.app</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
