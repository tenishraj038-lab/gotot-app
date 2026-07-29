import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA / Takedown - GoTot",
  description: "Submit a DMCA takedown request to GoTot for copyright infringement claims.",
  openGraph: {
    title: "DMCA / Takedown - GoTot",
    description: "Submit a DMCA takedown request to GoTot for copyright infringement claims.",
    type: "website",
    url: "https://gotot.app/dmca",
  },
  twitter: {
    card: "summary_large_image",
    title: "DMCA / Takedown - GoTot",
    description: "Submit a DMCA takedown request to GoTot for copyright infringement claims.",
  },
  alternates: {
    canonical: "https://gotot.app/dmca",
  },
};

export default function DmcaPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-2">DMCA / Takedown Notice</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: July 23, 2026</p>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-400">
          <section aria-labelledby="dmca-heading">
            <h2 id="dmca-heading" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">Digital Millennium Copyright Act (DMCA) Policy</h2>
            <p>
              GoTot (&quot;the Service&quot;) respects the intellectual property rights of others and
              expects its users to do the same. In accordance with the Digital Millennium Copyright Act
              of 1998 (&quot;DMCA&quot;), the text of which may be found on the U.S. Copyright Office
              website at{" "}
              <a href="https://www.copyright.gov/legislation/dmca.pdf" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                https://www.copyright.gov/legislation/dmca.pdf
              </a>
              , GoTot will respond expeditiously to claims of copyright infringement committed using
              the Service.
            </p>
          </section>

          <section aria-labelledby="filing-heading">
            <h2 id="filing-heading" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">Filing a DMCA Takedown Notice</h2>
            <p>
              If you are a copyright owner or an agent thereof, and you believe that any content
              accessible through GoTot infringes your copyright, you may submit a written DMCA
              takedown notice to our Designated Copyright Agent at:
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg my-4">
              <p className="font-medium">GoTot DMCA Agent</p>
              <p>Email: <a href="mailto:dmca@gotot.app" className="text-primary-600 hover:underline">dmca@gotot.app</a></p>
            </div>

            <p>Your takedown notice must include the following elements required by 17 U.S.C. § 512(c)(3):</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>A physical or electronic signature</strong> of a person authorized to act on behalf of the
                owner of an exclusive right that is allegedly infringed.
              </li>
              <li>
                <strong>Identification of the copyrighted work</strong> claimed to have been infringed, or, if
                multiple copyrighted works are covered by a single notification, a representative list of such works.
              </li>
              <li>
                <strong>Identification of the material</strong> that is claimed to be infringing or to be the subject
                of infringing activity and that is to be removed or access to which is to be disabled, and information
                reasonably sufficient to permit us to locate the material (including the URL).
              </li>
              <li>
                <strong>Information reasonably sufficient to permit us to contact you,</strong> such as an address,
                telephone number, and, if available, an email address.
              </li>
              <li>
                <strong>A statement that you have a good faith belief</strong> that use of the material in the manner
                complained of is not authorized by the copyright owner, its agent, or the law.
              </li>
              <li>
                <strong>A statement that the information in the notification is accurate, and under penalty of
                perjury,</strong> that you are authorized to act on behalf of the owner of an exclusive right that
                is allegedly infringed.
              </li>
            </ul>
          </section>

          <section aria-labelledby="counter-heading">
            <h2 id="counter-heading" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">Counter-Notification Procedure</h2>
            <p>
              If you believe that material you posted was removed or access to it was disabled by mistake
              or misidentification, you may file a counter-notification with us. Your counter-notification
              must include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your physical or electronic signature.</li>
              <li>Identification of the material that has been removed and the location where it appeared.</li>
              <li>A statement under penalty of perjury that you have a good-faith belief the material was removed or disabled as a result of mistake or misidentification.</li>
              <li>Your name, address, and telephone number, and a statement that you consent to the jurisdiction of the federal court in your district.</li>
            </ul>
            <p className="mt-4">
              Upon receipt of a valid counter-notification, we will forward it to the original complaining
              party and may restore the removed material within 10–14 business days unless the copyright
              owner files an action seeking a court order against you.
            </p>
          </section>

          <section aria-labelledby="repeat-heading">
            <h2 id="repeat-heading" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">Repeat Infringer Policy</h2>
            <p>
              GoTot maintains a repeat infringer policy. Accounts that receive three valid DMCA notices
              within a rolling 12-month period may face:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A warning for the first valid notice</li>
              <li>Temporary suspension of download privileges for the second valid notice</li>
              <li>Permanent account termination for the third valid notice</li>
            </ul>
            <p className="mt-4">Users may appeal any action by submitting a written appeal to <a href="mailto:dmca@gotot.app" className="text-primary-600 hover:underline">dmca@gotot.app</a> with supporting evidence.</p>
          </section>

          <section aria-labelledby="agent-heading">
            <h2 id="agent-heading" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">Designated DMCA Agent</h2>
            <p>
              GoTot maintains a designated DMCA Agent. Contact information:
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg my-4">
              <p className="font-medium">GoTot DMCA Agent</p>
              <p>Email: <a href="mailto:dmca@gotot.app" className="text-primary-600 hover:underline">dmca@gotot.app</a></p>
            </div>
          </section>

          <section aria-labelledby="changes-heading">
            <h2 id="changes-heading" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">Changes to This Policy</h2>
            <p>
              GoTot may update this policy periodically. Material changes may be announced through
              website notices, email (where applicable), and dashboard notifications.
            </p>
            <p className="mt-2">Last Updated: July 23, 2026</p>
          </section>

          <section aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">Contact</h2>
            <p>
              For all DMCA and copyright-related inquiries, contact us at{" "}
              <a href="mailto:dmca@gotot.app" className="text-primary-600 hover:underline">
                dmca@gotot.app
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
