import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import NewsletterSignup from "./NewsletterSignup";

const CONTACT_EMAILS = {
  support: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@gotot.app",
  dmca: process.env.NEXT_PUBLIC_DMCA_EMAIL || "dmca@gotot.app",
  legal: process.env.NEXT_PUBLIC_LEGAL_EMAIL || "legal@gotot.app",
  privacy: process.env.NEXT_PUBLIC_PRIVACY_EMAIL || "privacy@gotot.app",
  security: process.env.NEXT_PUBLIC_SECURITY_EMAIL || "security@gotot.app",
  business: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "business@gotot.app",
};

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-gray-200/50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-lg font-bold text-gradient">GoTot</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              {t.footer.description}
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
              <a href={`mailto:${CONTACT_EMAILS.support}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{CONTACT_EMAILS.support}</a>
              <span>·</span>
              <a href={`mailto:${CONTACT_EMAILS.dmca}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">DMCA</a>
              <span>·</span>
              <a href={`mailto:${CONTACT_EMAILS.legal}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Legal</a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">{t.footer.downloaders}</h3>
            <ul className="space-y-2">
              <li><Link href="/download/tiktok" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">TikTok</Link></li>
              <li><Link href="/download/instagram" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Instagram</Link></li>
              <li><Link href="/download/twitter" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Twitter / X</Link></li>
              <li><Link href="/download/facebook" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Facebook</Link></li>
              <li><Link href="/download/reddit" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Reddit</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">{t.footer.morePlatforms}</h3>
            <ul className="space-y-2">
              <li><Link href="/download/vimeo" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Vimeo</Link></li>
              <li><Link href="/download/twitch" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Twitch</Link></li>
              <li><Link href="/download/dailymotion" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Dailymotion</Link></li>
              <li><Link href="/download/linkedin" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">LinkedIn</Link></li>
              <li><Link href="/download/pinterest" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Pinterest</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">{t.footer.company}</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">About</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Blog</Link></li>
              <li><Link href="/changelog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Changelog</Link></li>
              <li><Link href="/docs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">API Docs</Link></li>
              <li><Link href="/status" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Status</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">{t.footer.legal}</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Terms of Service</Link></li>
              <li><Link href="/copyright" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Copyright Policy</Link></li>
              <li><Link href="/dmca" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">DMCA Policy</Link></li>
              <li><Link href="/cookie-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Cookie Policy</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Subscribe Section */}
        <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="max-w-md mx-auto text-center mb-8">
            <h3 className="text-sm font-semibold mb-2">Subscribe for updates</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Get the latest features and updates</p>
            <NewsletterSignup />
          </div>
        </div>

        {/* Contact Emails */}
        <div className="pt-8 border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <span>Support: <a href={`mailto:${CONTACT_EMAILS.support}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{CONTACT_EMAILS.support}</a></span>
            <span>DMCA: <a href={`mailto:${CONTACT_EMAILS.dmca}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{CONTACT_EMAILS.dmca}</a></span>
            <span>Legal: <a href={`mailto:${CONTACT_EMAILS.legal}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{CONTACT_EMAILS.legal}</a></span>
            <span>Privacy: <a href={`mailto:${CONTACT_EMAILS.privacy}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{CONTACT_EMAILS.privacy}</a></span>
            <span>Security: <a href={`mailto:${CONTACT_EMAILS.security}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{CONTACT_EMAILS.security}</a></span>
            <span>Business: <a href={`mailto:${CONTACT_EMAILS.business}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{CONTACT_EMAILS.business}</a></span>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="pt-6 border-t border-gray-200/50 dark:border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} GoTot. {t.footer.rights}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            <a href="https://twitter.com/gotot" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Twitter</a>
            <a href="https://github.com/gotot" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">GitHub</a>
            <a href="https://discord.gg/gotot" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Discord</a>
            <span>|</span>
            <span>{t.footer.madeWith}</span>
            <span>|</span>
            <span>{t.footer.notAffiliated}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
